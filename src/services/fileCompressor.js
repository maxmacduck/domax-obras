// Serviço de compressão e conversão de arquivos para Base64
// Usado para armazenar arquivos diretamente no Firestore (sem Firebase Storage)

import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();

const MAX_IMAGE_DIMENSION = 1600; // pixels
const INITIAL_QUALITY = 0.8;
const MIN_QUALITY = 0.3;
const QUALITY_STEP = 0.1;

// Configurações de compressão de PDF
const PDF_RENDER_SCALE = 1.2; // Escala de renderização (1.0 = 72dpi, 1.5 = 108dpi, 2.0 = 144dpi)
const PDF_MIN_SCALE = 0.6;
const PDF_SCALE_STEP = 0.2;
const PDF_JPEG_QUALITY = 0.65;

/**
 * Comprime uma imagem usando Canvas API
 * Reduz dimensões e qualidade JPEG progressivamente até caber no tamanho máximo
 * @param {File} file - Arquivo de imagem
 * @param {number} maxSizeKB - Tamanho máximo em KB (padrão: 700)
 * @returns {Promise<{base64: string, nome: string, tipo: string, tamanho: number}>}
 */
export const compressImage = (file, maxSizeKB = 700) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calcular dimensões mantendo proporção
                    let { width, height } = img;
                    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
                        const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Tentar comprimir progressivamente
                    let quality = INITIAL_QUALITY;
                    let base64 = canvas.toDataURL('image/jpeg', quality);

                    while (getBase64SizeKB(base64) > maxSizeKB && quality > MIN_QUALITY) {
                        quality -= QUALITY_STEP;
                        base64 = canvas.toDataURL('image/jpeg', quality);
                    }

                    // Se ainda for grande demais, reduzir dimensões
                    if (getBase64SizeKB(base64) > maxSizeKB) {
                        let scale = 0.8;
                        while (getBase64SizeKB(base64) > maxSizeKB && scale > 0.3) {
                            canvas.width = Math.round(width * scale);
                            canvas.height = Math.round(height * scale);
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            base64 = canvas.toDataURL('image/jpeg', MIN_QUALITY);
                            scale -= 0.1;
                        }
                    }

                    const finalSizeKB = getBase64SizeKB(base64);
                    console.log(`Imagem comprimida: ${(file.size / 1024).toFixed(0)}KB → ${finalSizeKB.toFixed(0)}KB (qualidade: ${quality.toFixed(1)})`);

                    resolve({
                        base64,
                        nome: file.name,
                        tipo: 'image/jpeg',
                        tamanho: finalSizeKB * 1024,
                        comprimido: true
                    });
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = () => reject(new Error('Erro ao carregar imagem'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsDataURL(file);
    });
};

/**
 * Comprime um PDF renderizando suas páginas como imagens JPEG comprimidas
 * e remontando em um novo PDF menor
 * @param {File} file - Arquivo PDF
 * @param {number} maxSizeKB - Tamanho máximo em KB (padrão: 700)
 * @returns {Promise<{base64: string, nome: string, tipo: string, tamanho: number}>}
 */
export const compressPDF = async (file, maxSizeKB = 700) => {
    try {
        // Ler o arquivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Carregar o PDF com pdf.js
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdfDoc.numPages;

        console.log(`Comprimindo PDF: ${numPages} página(s), ${(file.size / 1024).toFixed(0)}KB original`);

        let scale = PDF_RENDER_SCALE;
        let jpegQuality = PDF_JPEG_QUALITY;
        let base64Result = null;

        // Tentar comprimir com escalas progressivamente menores
        while (scale >= PDF_MIN_SCALE) {
            const pageImages = [];

            // Renderizar cada página como imagem
            for (let i = 1; i <= numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Fundo branco
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).promise;

                // Converter canvas para JPEG
                const imgData = canvas.toDataURL('image/jpeg', jpegQuality);
                pageImages.push({
                    data: imgData,
                    width: viewport.width,
                    height: viewport.height
                });
            }

            // Criar novo PDF com jsPDF
            const firstPage = pageImages[0];
            const pdf = new jsPDF({
                orientation: firstPage.width > firstPage.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [firstPage.width, firstPage.height]
            });

            // Adicionar cada página
            for (let i = 0; i < pageImages.length; i++) {
                const pageImg = pageImages[i];

                if (i > 0) {
                    pdf.addPage([pageImg.width, pageImg.height],
                        pageImg.width > pageImg.height ? 'landscape' : 'portrait');
                }

                pdf.addImage(pageImg.data, 'JPEG', 0, 0, pageImg.width, pageImg.height);
            }

            // Gerar base64 do PDF comprimido
            base64Result = pdf.output('datauristring');
            const sizeKB = getBase64SizeKB(base64Result);

            console.log(`PDF comprimido (escala: ${scale.toFixed(1)}, qualidade: ${jpegQuality}): ${sizeKB.toFixed(0)}KB`);

            if (sizeKB <= maxSizeKB) {
                break;
            }

            // Reduzir escala e qualidade para próxima tentativa
            scale -= PDF_SCALE_STEP;
            jpegQuality = Math.max(0.3, jpegQuality - 0.1);
        }

        const finalSizeKB = getBase64SizeKB(base64Result);

        if (finalSizeKB > maxSizeKB) {
            throw new Error(
                `PDF muito grande mesmo após compressão (${finalSizeKB.toFixed(0)}KB). ` +
                `O limite é ${maxSizeKB}KB. Tente um PDF com menos páginas.`
            );
        }

        console.log(`PDF final: ${(file.size / 1024).toFixed(0)}KB → ${finalSizeKB.toFixed(0)}KB`);

        return {
            base64: base64Result,
            nome: file.name,
            tipo: 'application/pdf',
            tamanho: finalSizeKB * 1024,
            comprimido: true
        };
    } catch (error) {
        if (error.message.includes('muito grande')) {
            throw error;
        }
        console.error('Erro ao comprimir PDF:', error);
        throw new Error('Erro ao comprimir PDF. Tente novamente ou use um arquivo menor.');
    }
};

/**
 * Converte um arquivo para Base64
 * @param {File} file - Arquivo a converter
 * @returns {Promise<{base64: string, nome: string, tipo: string, tamanho: number}>}
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve({
                base64: e.target.result,
                nome: file.name,
                tipo: file.type,
                tamanho: file.size,
                comprimido: false
            });
        };
        reader.onerror = () => reject(new Error('Erro ao converter arquivo'));
        reader.readAsDataURL(file);
    });
};

/**
 * Verifica se o arquivo é uma imagem
 * @param {File} file
 * @returns {boolean}
 */
export const isImage = (file) => {
    return file.type.startsWith('image/');
};

/**
 * Verifica se o arquivo é um PDF
 * @param {File} file
 * @returns {boolean}
 */
export const isPDF = (file) => {
    return file.type === 'application/pdf';
};

/**
 * Calcula o tamanho em KB de uma string Base64
 * @param {string} base64 - String base64
 * @returns {number} Tamanho em KB
 */
export const getBase64SizeKB = (base64) => {
    // Remover header (data:image/jpeg;base64,)
    const stringLength = base64.length - (base64.indexOf(',') + 1);
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes / 1024;
};

/**
 * Processa um arquivo para armazenamento no Firestore
 * - Imagens: comprime se necessário
 * - PDFs: comprime renderizando páginas como JPEG
 * - Outros arquivos: converte para Base64 com validação de tamanho
 * @param {File} file - Arquivo a processar
 * @param {number} maxSizeKB - Tamanho máximo em KB (padrão: 700)
 * @returns {Promise<{base64: string, nome: string, tipo: string, tamanho: number}>}
 */
export const processFileForStorage = async (file, maxSizeKB = 700) => {
    if (isImage(file)) {
        return await compressImage(file, maxSizeKB);
    } else if (isPDF(file)) {
        // Verificar se já cabe sem comprimir
        const result = await fileToBase64(file);
        const sizeKB = getBase64SizeKB(result.base64);

        if (sizeKB <= maxSizeKB) {
            console.log(`PDF já cabe no limite (${sizeKB.toFixed(0)}KB <= ${maxSizeKB}KB)`);
            return result;
        }

        // Comprimir PDF
        console.log(`PDF excede o limite (${sizeKB.toFixed(0)}KB > ${maxSizeKB}KB). Comprimindo...`);
        return await compressPDF(file, maxSizeKB);
    } else {
        // Outros arquivos: converter diretamente
        const result = await fileToBase64(file);
        const sizeKB = getBase64SizeKB(result.base64);

        if (sizeKB > maxSizeKB) {
            throw new Error(
                `Arquivo muito grande (${(sizeKB / 1024).toFixed(1)} MB). ` +
                `O tamanho máximo é ${(maxSizeKB / 1024).toFixed(1)} MB. ` +
                `Tente comprimir o arquivo antes de fazer upload.`
            );
        }

        return result;
    }
};
