// Serviço Firestore para gerenciar dados da obra
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// ID do projeto padrão (futuramente pode ser multi-projeto)
const DEFAULT_PROJECT_ID = 'projeto-principal';

// ==================== PROJETO ====================

export const getProjeto = async (projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const docRef = doc(db, 'projetos', projetoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            // Criar projeto padrão se não existir
            const novoProjeto = {
                nome: 'Novo Projeto',
                orcamentoTotal: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            await setDoc(docRef, novoProjeto);
            return { id: projetoId, ...novoProjeto };
        }
    } catch (error) {
        console.error('Erro ao buscar projeto:', error);
        throw error;
    }
};

export const updateProjeto = async (projetoId = DEFAULT_PROJECT_ID, data) => {
    try {
        const docRef = doc(db, 'projetos', projetoId);
        await setDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        throw error;
    }
};

// ==================== CUSTOS ====================

export const getCustos = async (projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const q = query(
            collection(db, 'custos'),
            where('projetoId', '==', projetoId)
        );
        const querySnapshot = await getDocs(q);
        const custos = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        // Ordenar localmente ao invés de no Firestore (evita necessidade de índice)
        return custos.sort((a, b) => new Date(b.data) - new Date(a.data));
    } catch (error) {
        console.error('Erro ao buscar custos:', error);
        throw error;
    }
};

export const addCusto = async (custo, projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const docRef = await addDoc(collection(db, 'custos'), {
            ...custo,
            projetoId,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao adicionar custo:', error);
        throw error;
    }
};

export const updateCusto = async (id, data) => {
    try {
        const docRef = doc(db, 'custos', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Erro ao atualizar custo:', error);
        throw error;
    }
};

export const deleteCusto = async (id) => {
    try {
        await deleteDoc(doc(db, 'custos', id));
    } catch (error) {
        console.error('Erro ao deletar custo:', error);
        throw error;
    }
};

// ==================== ETAPAS ====================

export const getEtapas = async (projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const q = query(
            collection(db, 'etapas'),
            where('projetoId', '==', projetoId)
        );
        const querySnapshot = await getDocs(q);
        const etapas = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        // Ordenar localmente ao invés de no Firestore (evita necessidade de índice)
        return etapas.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
    } catch (error) {
        console.error('Erro ao buscar etapas:', error);
        throw error;
    }
};

export const addEtapa = async (etapa, projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const docRef = await addDoc(collection(db, 'etapas'), {
            ...etapa,
            projetoId,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao adicionar etapa:', error);
        throw error;
    }
};

export const updateEtapa = async (id, data) => {
    try {
        const docRef = doc(db, 'etapas', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Erro ao atualizar etapa:', error);
        throw error;
    }
};

export const deleteEtapa = async (id) => {
    try {
        await deleteDoc(doc(db, 'etapas', id));
    } catch (error) {
        console.error('Erro ao deletar etapa:', error);
        throw error;
    }
};

// ==================== DOCUMENTOS ====================

export const getDocumentos = async (projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const q = query(
            collection(db, 'documentos'),
            where('projetoId', '==', projetoId)
        );
        const querySnapshot = await getDocs(q);
        const documentos = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        // Ordenar localmente ao invés de no Firestore (evita necessidade de índice)
        return documentos.sort((a, b) => new Date(b.data) - new Date(a.data));
    } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        throw error;
    }
};

export const addDocumento = async (documento, projetoId = DEFAULT_PROJECT_ID) => {
    try {
        const docRef = await addDoc(collection(db, 'documentos'), {
            ...documento,
            projetoId,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao adicionar documento:', error);
        throw error;
    }
};

export const deleteDocumento = async (id) => {
    try {
        await deleteDoc(doc(db, 'documentos', id));
    } catch (error) {
        console.error('Erro ao deletar documento:', error);
        throw error;
    }
};

// ==================== LISTENERS EM TEMPO REAL ====================

export const onCustosChange = (callback, projetoId = DEFAULT_PROJECT_ID) => {
    const q = query(
        collection(db, 'custos'),
        where('projetoId', '==', projetoId)
    );
    return onSnapshot(q, (snapshot) => {
        const custos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        callback(custos);
    });
};

export const onEtapasChange = (callback, projetoId = DEFAULT_PROJECT_ID) => {
    const q = query(
        collection(db, 'etapas'),
        where('projetoId', '==', projetoId)
    );
    return onSnapshot(q, (snapshot) => {
        const etapas = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        callback(etapas);
    });
};

export const onDocumentosChange = (callback, projetoId = DEFAULT_PROJECT_ID) => {
    const q = query(
        collection(db, 'documentos'),
        where('projetoId', '==', projetoId)
    );
    return onSnapshot(q, (snapshot) => {
        const documentos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        callback(documentos);
    });
};
