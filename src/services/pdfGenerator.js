import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Gera relatório PDF profissional de pagamentos de mão de obra
 * @param {Array} custos - Custos de mão de obra pagos
 * @param {Array} documentos - Documentos relacionados
 * @param {Object} projeto - Dados do projeto
 */
export const generateWorkerPaymentReport = (custos, documentos, projeto) => {
    const doc = new jsPDF();

    // Configurações
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Adicionar cabeçalho
    addHeader(doc, projeto, pageWidth);

    // Adicionar tabela de custos
    const finalY = addWorkersTable(doc, custos);

    // Adicionar total
    addTotal(doc, custos, finalY);

    // Adicionar documentos anexados (se houver)
    if (documentos && documentos.length > 0) {
        addDocumentAttachments(doc, documentos, pageHeight);
    }

    // Adicionar rodapé em todas as páginas
    addFooter(doc);

    // Salvar PDF
    const fileName = `relatorio-mao-de-obra-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};

/**
 * Adiciona cabeçalho profissional ao PDF
 */
const addHeader = (doc, projeto, pageWidth) => {
    // Fundo azul do cabeçalho
    doc.setFillColor(30, 58, 138); // #1e3a8a
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE PAGAMENTOS', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.text('Mão de Obra', pageWidth / 2, 23, { align: 'center' });

    // Informações do projeto
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Projeto: ${projeto.nome}`, 15, 33);
    doc.text(`Data: ${dataAtual}`, pageWidth - 15, 33, { align: 'right' });

    // Resetar cor do texto
    doc.setTextColor(0, 0, 0);
};

/**
 * Adiciona tabela de custos de mão de obra
 */
const addWorkersTable = (doc, custos) => {
    const tableData = custos.map(custo => [
        new Date(custo.data).toLocaleDateString('pt-BR'),
        custo.descricao,
        custo.temDocumento ? '✓' : '−',
        formatCurrency(custo.valor)
    ]);

    autoTable(doc, {
        startY: 50,
        head: [['Data', 'Descrição', 'Doc.', 'Valor']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [100, 116, 139], // #64748b
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 11
        },
        bodyStyles: {
            fontSize: 10
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 90 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 40, halign: 'right' }
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    return doc.lastAutoTable.finalY;
};

/**
 * Adiciona total ao final da tabela
 */
const addTotal = (doc, custos, startY) => {
    const total = custos.reduce((sum, custo) => sum + custo.valor, 0);
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(22, 163, 74); // #16a34a (verde)
    doc.setTextColor(255, 255, 255);

    const boxY = startY + 10;
    doc.rect(pageWidth - 80, boxY, 65, 10, 'F');
    doc.text(`TOTAL: ${formatCurrency(total)}`, pageWidth - 15, boxY + 7, { align: 'right' });

    doc.setTextColor(0, 0, 0);
};

/**
 * Adiciona documentos anexados aos custos como novas páginas
 * @param {jsPDF} doc - Instância do jsPDF
 * @param {Array} custosComDoc - Custos que possuem documento anexado (com base64)
 * @param {number} pageHeight - Altura da página
 */
const addDocumentAttachments = (doc, custosComDoc, pageHeight) => {
    if (custosComDoc.length === 0) return;

    const pageWidth = doc.internal.pageSize.width;

    doc.addPage();

    // Título da seção de anexos
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ANEXOS — DOCUMENTOS COMPROBATÓRIOS', pageWidth / 2, 16, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    let currentY = 35;

    custosComDoc.forEach((custo, index) => {
        const documento = custo.documento;
        if (!documento) return;

        // Verificar se precisa de nova página
        if (currentY > pageHeight - 100) {
            doc.addPage();
            currentY = 20;
        }

        // Cabeçalho do anexo
        doc.setFillColor(240, 240, 240);
        doc.rect(15, currentY - 5, pageWidth - 30, 20, 'F');

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        doc.text(`Anexo ${index + 1}: ${documento.nome || 'Documento'}`, 20, currentY + 4);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(
            `Custo: ${custo.descricao} | Valor: ${formatCurrency(custo.valor)} | Tipo: ${custo.tipoDocumento || 'N/A'}`,
            20,
            currentY + 11
        );

        currentY += 22;
        doc.setTextColor(0, 0, 0);

        // Tentar incorporar o documento se for imagem base64
        const base64Data = documento.base64 || documento.url || (documento.dados);

        if (base64Data && base64Data.startsWith('data:image')) {
            try {
                // Calcular dimensões da imagem mantendo proporção
                const maxWidth = pageWidth - 40;
                const maxHeight = pageHeight - currentY - 30;
                const imgHeight = Math.min(maxHeight, 120);

                doc.addImage(base64Data, 'JPEG', 20, currentY, maxWidth, imgHeight);
                currentY += imgHeight + 15;
            } catch (error) {
                console.error('Erro ao adicionar imagem ao PDF:', error);
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text('(Erro ao renderizar imagem)', 20, currentY + 5);
                doc.setTextColor(0, 0, 0);
                currentY += 15;
            }
        } else if (base64Data && base64Data.startsWith('data:application/pdf')) {
            // PDF embutido — não dá para renderizar diretamente, indicar presença
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(`📎 Documento PDF armazenado: ${documento.nome}`, 20, currentY + 5);
            doc.text(`   Tamanho: ${documento.tamanho ? (documento.tamanho / 1024).toFixed(0) + ' KB' : 'N/A'}`, 20, currentY + 11);
            doc.setTextColor(0, 0, 0);
            currentY += 20;
        } else {
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text('(Documento sem visualização disponível)', 20, currentY + 5);
            doc.setTextColor(0, 0, 0);
            currentY += 15;
        }

        // Linha separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(15, currentY, pageWidth - 15, currentY);
        currentY += 10;
    });
};

/**
 * Adiciona rodapé com número de páginas
 */
const addFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
            `Página ${i} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
        doc.text(
            'DoMAX Obras - Sistema de Gestão de Obras',
            pageWidth / 2,
            pageHeight - 5,
            { align: 'center' }
        );
    }
};

/**
 * Formata valor para moeda brasileira
 */
const formatCurrency = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};
