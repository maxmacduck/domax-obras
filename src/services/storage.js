// Serviço de armazenamento de arquivos via Base64 no Firestore
// Substitui o Firebase Storage (que requer plano Blaze)
import { processFileForStorage } from './fileCompressor';

/**
 * Processa e prepara um arquivo para armazenamento no Firestore como Base64
 * @param {File} file - Arquivo a ser processado
 * @returns {Promise<{base64: string, nome: string, tipo: string, tamanho: number}>}
 */
export const uploadFile = async (file) => {
    try {
        const result = await processFileForStorage(file, 700);
        return result;
    } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        throw error;
    }
};

/**
 * "Deleta" um arquivo - no modo Base64/Firestore, não há arquivo externo para deletar
 * O arquivo é removido quando o documento Firestore é deletado
 * @param {string} path - Caminho (ignorado, mantido para compatibilidade)
 */
export const deleteFile = async (path) => {
    // No modo Base64, o arquivo está embutido no documento Firestore
    // Não há nada para deletar separadamente
    console.log('deleteFile: arquivo embutido no Firestore, nada para deletar externamente.');
};

/**
 * Gera um nome de arquivo único
 * @param {string} originalName - Nome original do arquivo
 * @returns {string} Nome único com timestamp
 */
export const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(`.${extension}`, '');
    return `${nameWithoutExt}_${timestamp}_${randomStr}.${extension}`;
};

// Exportar como objeto para manter compatibilidade com imports existentes
const storageService = {
    uploadFile,
    deleteFile,
    generateUniqueFileName
};

export default storageService;
