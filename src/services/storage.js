// Serviço Firebase Storage para upload e gerenciamento de arquivos
import {
    ref,
    uploadBytes,
    uploadString,
    getDownloadURL,
    deleteObject,
    listAll
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Faz upload de um arquivo para o Firebase Storage
 * @param {File|Blob} file - Arquivo a ser enviado
 * @param {string} path - Caminho no storage (ex: 'documentos/projeto1/arquivo.pdf')
 * @returns {Promise<string>} URL de download do arquivo
 */
export const uploadFile = async (file, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
};

/**
 * Faz upload de um arquivo a partir de uma string base64 (para arquivos salvos no storage antigo)
 * @param {string} base64String - String base64 do arquivo
 * @param {string} path - Caminho no storage
 * @returns {Promise<string>} URL de download do arquivo
 */
export const uploadBase64 = async (base64String, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadString(storageRef, base64String, 'data_url');
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Erro ao fazer upload base64:', error);
        throw error;
    }
};

/**
 * Obtém a URL de download de um arquivo
 * @param {string} path - Caminho do arquivo no storage
 * @returns {Promise<string>} URL de download
 */
export const getFileURL = async (path) => {
    try {
        const storageRef = ref(storage, path);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error('Erro ao obter URL:', error);
        throw error;
    }
};

/**
 * Remove um arquivo do storage
 * @param {string} path - Caminho do arquivo a ser removido
 */
export const deleteFile = async (path) => {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        throw error;
    }
};

/**
 * Lista todos os arquivos em uma pasta
 * @param {string} path - Caminho da pasta
 * @returns {Promise<Array>} Lista de referências de arquivos
 */
export const listFiles = async (path) => {
    try {
        const storageRef = ref(storage, path);
        const result = await listAll(storageRef);
        return result.items;
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        throw error;
    }
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
