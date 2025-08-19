// src/App.jsx

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

// --- CONFIGURAÇÃO DO FIREBASE ---
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp, 
    query, 
    getDoc, 
    orderBy,
    setDoc 
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

// Configuração do Firebase com as credenciais diretamente no código.
const firebaseConfig = {
  apiKey: "AIzaSyCtdqzrPbGcVX7ALspDHW4vtaBIXNkWtnk",
  authDomain: "base-conhecimento-app-14b9a.firebaseapp.com",
  projectId: "base-conhecimento-app-14b9a",
  storageBucket: "base-conhecimento-app-14b9a.appspot.com",
  messagingSenderId: "872795912891",
  appId: "1:872795912891:web:fc0c01c16f1bda68cb079e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// --- ÍCONES ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const Trash2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SpinnerIcon = ({className = "w-5 h-5"}) => <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const UserCogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.5 17.8.9.3"/><path d="m14.8 16.1.9.3"/><path d="m17.4 11.3-.3.9"/><path d="m14.9 18.9-.3.9"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// --- CONTEXTO DE TEMA (DARK/LIGHT MODE) ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

// --- CONTEXTO DE AUTENTICAÇÃO ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                setUser(userDoc.exists() ? { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() } : { uid: firebaseUser.uid, email: firebaseUser.email, role: 'user', name: 'Novo Usuário' });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);
    const register = async (name, email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await setDoc(doc(db, "users", userCredential.user.uid), {
            name: name,
            role: "user"
        });
        return userCredential;
    };
    const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

    const authContextValue = { user, setUser, login, logout, register, sendPasswordReset, isAuthenticated: !!user, loading };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><SpinnerIcon className="w-8 h-8 text-gray-700" /><span className="text-xl ml-3 text-gray-700">Carregando...</span></div>;
    }

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// --- COMPONENTES DA UI ---
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

const SuccessPopup = ({ message, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div className={`fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            {message}
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-3 rounded-full mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const QuestionForm = ({ currentQuestion, onSave, onClear, isLoading }) => {
    const [formData, setFormData] = useState({ theme: '', question_text: '', answer_text: '' });

    useEffect(() => {
        if (currentQuestion) {
            setFormData({ theme: currentQuestion.theme, question_text: currentQuestion.question_text, answer_text: currentQuestion.answer_text });
        } else {
            setFormData({ theme: '', question_text: '', answer_text: '' });
        }
    }, [currentQuestion]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.theme.trim() || !formData.question_text.trim() || !formData.answer_text.trim()) {
            alert('Por favor, preencha todos os campos de texto.');
            return;
        }
        onSave({ ...currentQuestion, ...formData });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{currentQuestion ? 'Editar Pergunta' : 'Cadastrar Nova Pergunta'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tema</label>
                    <input type="text" id="theme" name="theme" value={formData.theme} onChange={(e) => setFormData({...formData, theme: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Impressoras, PDV" />
                </div>
                <div className="mb-4">
                    <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pergunta</label>
                    <textarea id="question_text" name="question_text" value={formData.question_text} onChange={(e) => setFormData({...formData, question_text: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Digite a pergunta completa"></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="answer_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resposta</label>
                    <textarea id="answer_text" name="answer_text" value={formData.answer_text} onChange={(e) => setFormData({...formData, answer_text: e.target.value})} rows="10" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Digite a solução detalhada."></textarea>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button type="button" onClick={onClear} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition" disabled={isLoading}>Limpar</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center w-48" disabled={isLoading}>
                        {isLoading ? <SpinnerIcon className="w-5 h-5 text-white" /> : <><PlusCircleIcon className="w-5 h-5 mr-2" />{currentQuestion ? 'Salvar' : 'Cadastrar'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

const QuestionsTable = ({ questions, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Perguntas Cadastradas</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tema</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pergunta</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {questions.length === 0 ? (
                        <tr><td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhuma pergunta cadastrada.</td></tr>
                    ) : (
                        questions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{q.theme}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-md truncate" title={q.question_text}>{q.question_text}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                    <button onClick={() => onEdit(q)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2"><EditIcon /></button>
                                    <button onClick={() => onDelete(q.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 ml-2"><Trash2Icon /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const ViewHistoryTable = ({ history }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Histórico de Visualizações</h2>
        <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pergunta</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {history.length === 0 ? (
                        <tr><td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhuma visualização registrada.</td></tr>
                    ) : (
                        history.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-md truncate" title={item.questionText}>{item.questionText}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.userName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.viewedAt.toDate().toLocaleString('pt-BR')}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const UsersTable = ({ users, onRoleChange }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Gerenciamento de Usuários</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permissão</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.length === 0 ? (
                        <tr><td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhum usuário encontrado.</td></tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <select
                                        value={user.role}
                                        onChange={(e) => onRoleChange(user.uid, e.target.value)}
                                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="user">Usuário</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const UserProfileModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user.name);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            await updateProfile(auth.currentUser, { displayName: name });
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { name: name });
            setUser(prev => ({...prev, name: name}));
            setSuccess('Nome atualizado com sucesso!');
        } catch (err) {
            setError('Falha ao atualizar o nome.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('As novas senhas não coincidem.');
            setLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setError('A nova senha deve ter no mínimo 6 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            setSuccess('Senha alterada com sucesso!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError('Senha antiga incorreta ou falha na reautenticação.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><XIcon /></button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Meu Perfil</h2>
                
                {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}
                {success && <p className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">{success}</p>}

                <form onSubmit={handleNameUpdate} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Alterar Nome</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">Nome</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center" disabled={loading}>{loading ? <SpinnerIcon /> : 'Salvar Nome'}</button>
                </form>

                <form onSubmit={handlePasswordUpdate}>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Alterar Senha</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="oldPassword">Senha Antiga</label>
                        <input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="newPassword">Nova Senha</label>
                        <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center" disabled={loading}>{loading ? <SpinnerIcon /> : 'Alterar Senha'}</button>
                </form>
            </div>
        </div>
    );
};


// --- PÁGINAS ---
const LoginPage = () => {
    const [mode, setMode] = useState('login'); // 'login', 'register', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');
        try {
            await auth.login(email, password);
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');
        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            setLoading(false);
            return;
        }
        try {
            await auth.register(name, email, password);
        } catch (err) {
            setError(err.code === 'auth/email-already-in-use' ? 'Este e-mail já está em uso.' : 'Falha ao registrar.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');
        try {
            await auth.sendPasswordReset(email);
            setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (err) {
            setError('Falha ao enviar e-mail de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <div className="absolute top-4 right-4"><ThemeToggle /></div>
                {mode === 'login' && (
                    <form onSubmit={handleLogin}>
                        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Bem-vindo!</h1>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Faça login para continuar.</p>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email-login">Email</label>
                            <input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password-login">Senha</label>
                            <input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center" disabled={loading}>{loading ? <SpinnerIcon /> : 'Entrar'}</button>
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => { setMode('reset'); setError(''); }} className="text-sm text-blue-500 hover:underline">Esqueceu a senha?</button>
                        </div>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">Não tem uma conta? <button type="button" onClick={() => { setMode('register'); setError(''); }} className="font-bold text-blue-500 hover:underline">Cadastre-se</button></p>
                    </form>
                )}

                {mode === 'register' && (
                    <form onSubmit={handleRegister}>
                        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Criar Conta</h1>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name-register">Nome</label>
                            <input id="name-register" type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email-register">Email</label>
                            <input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password-register">Senha</label>
                            <input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center" disabled={loading}>{loading ? <SpinnerIcon /> : 'Cadastrar'}</button>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">Já tem uma conta? <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-bold text-blue-500 hover:underline">Faça login</button></p>
                    </form>
                )}
                
                {mode === 'reset' && (
                    <form onSubmit={handleReset}>
                        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Recuperar Senha</h1>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email-reset">Email</label>
                            <input id="email-reset" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}
                        {message && <p className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">{message}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center" disabled={loading}>{loading ? <SpinnerIcon /> : 'Enviar E-mail de Recuperação'}</button>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"><button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="font-bold text-blue-500 hover:underline">&larr; Voltar para o Login</button></p>
                    </form>
                )}
            </div>
        </div>
    );
};

const AdminDashboard = ({ onSwitchView }) => {
    const auth = useAuth();
    const [questions, setQuestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const questionToDeleteId = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleErrors = (err, context) => {
            console.error(`Erro em ${context}: `, err);
            if (err.code === 'permission-denied') {
                setError('Erro de permissão. Verifique as regras de segurança do Firestore.');
            }
        };

        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const unsubscribeQuestions = onSnapshot(q, 
            (snapshot) => setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (err) => handleErrors(err, 'questions')
        );

        const h = query(collection(db, "viewHistory"), orderBy("viewedAt", "desc"));
        const unsubscribeHistory = onSnapshot(h, 
            (snapshot) => setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (err) => handleErrors(err, 'viewHistory')
        );

        const u = query(collection(db, "users"));
        const unsubscribeUsers = onSnapshot(u, 
            (snapshot) => setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))),
            (err) => handleErrors(err, 'users')
        );

        return () => {
            unsubscribeQuestions();
            unsubscribeHistory();
            unsubscribeUsers();
        };
    }, []);

    const handleSave = async (questionData) => {
        setIsLoading(true);
        try {
            if (questionData.id) {
                const { id, ...dataToUpdate } = questionData;
                await updateDoc(doc(db, "questions", id), { ...dataToUpdate, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, "questions"), { ...questionData, createdAt: serverTimestamp() });
                setShowSuccessPopup(true);
            }
            handleClear();
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (uid, newRole) => {
        const userRef = doc(db, "users", uid);
        try {
            await updateDoc(userRef, { role: newRole });
        } catch (error) {
            console.error("Erro ao alterar permissão:", error);
            alert("Não foi possível alterar a permissão. Verifique as regras de segurança.");
        }
    };

    const handleEdit = (question) => {
        setCurrentQuestion(question);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id) => {
        questionToDeleteId.current = id;
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (questionToDeleteId.current) {
            await deleteDoc(doc(db, "questions", questionToDeleteId.current));
            setIsModalOpen(false);
            questionToDeleteId.current = null;
        }
    };

    const handleClear = () => setCurrentQuestion(null);

    const totalQuestions = questions.length;
    const lastUpdate = totalQuestions > 0 && questions[0].createdAt ? questions[0].createdAt.toDate().toLocaleString('pt-BR') : 'N/A';
    const totalUsers = users.length;

    return (
        <>
            <SuccessPopup message="Cadastrado com sucesso!" show={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
            <ConfirmationModal isOpen={isModalOpen} title="Confirmar Exclusão" message="Tem certeza que deseja excluir esta pergunta?" onConfirm={confirmDelete} onCancel={() => setIsModalOpen(false)} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Painel Administrativo</h1>
                        <div className="flex items-center space-x-4">
                            <button onClick={onSwitchView} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition">
                                <EyeIcon className="w-4 h-4 mr-2" /> Ver como Usuário
                            </button>
                            <ThemeToggle />
                            <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">Olá, {auth.user.name}</span>
                            <button onClick={auth.logout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition">
                                <LogOutIcon className="w-4 h-4 mr-2" /> Sair
                            </button>
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total de Perguntas" value={totalQuestions} icon={<HomeIcon />} />
                        <StatCard title="Último Cadastro" value={lastUpdate} icon={<ClockIcon />} />
                        <StatCard title="Total de Visualizações" value={history.length} icon={<EyeIcon />} />
                        <StatCard title="Usuários Cadastrados" value={totalUsers} icon={<UsersIcon />} />
                    </div>
                    <QuestionForm currentQuestion={currentQuestion} onSave={handleSave} onClear={handleClear} isLoading={isLoading} />
                    <QuestionsTable questions={questions} onEdit={handleEdit} onDelete={handleDeleteClick} />
                    <UsersTable users={users} onRoleChange={handleRoleChange} />
                    <ViewHistoryTable history={history} />
                </main>
            </div>
        </>
    );
};

const UserHome = ({ isAdminView, onSwitchView }) => {
    const auth = useAuth();
    const [questions, setQuestions] = useState([]);
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuestions(allQuestions);
            setThemes([...new Set(allQuestions.map(q => q.theme))].sort());
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logView = async (question) => {
        try {
            await addDoc(collection(db, "viewHistory"), {
                questionId: question.id,
                questionText: question.question_text,
                userId: auth.user.uid,
                userName: auth.user.name,
                viewedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Erro ao registrar visualização:", error);
        }
    };
    
    const searchResults = searchTerm.trim() === '' ? [] : questions.filter(q =>
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const AccordionItem = ({ question }) => {
        const [isOpen, setIsOpen] = useState(false);
        const hasLogged = useRef(false);

        const handleToggle = () => {
            const newIsOpen = !isOpen;
            setIsOpen(newIsOpen);
            if (newIsOpen && !hasLogged.current) {
                logView(question);
                hasLogged.current = true;
            }
        };

        return (
            <div className="border-b border-gray-200 dark:border-gray-700">
                <button onClick={handleToggle} className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{question.question_text}</h3>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className="p-4 pt-0 bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                           {question.answer_text}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const displayedQuestions = selectedTheme ? questions.filter(q => q.theme === selectedTheme) : [];

    return (
        <>
        <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8 transition-colors duration-200">
            <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Base de Conhecimento</h1>
                <div className="flex items-center space-x-4">
                    {isAdminView && (
                         <button onClick={onSwitchView} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition">
                            Voltar ao Painel
                        </button>
                    )}
                    <button onClick={() => setProfileModalOpen(true)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        <UserCogIcon />
                    </button>
                    <ThemeToggle />
                    <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">Olá, {auth.user.name}</span>
                    <button onClick={auth.logout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition">
                        <LogOutIcon className="w-4 h-4 mr-2" /> Sair
                    </button>
                </div>
            </header>
            <main className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4">Como podemos ajudar?</h2>
                <div className="relative mb-12">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input type="text" placeholder="Pesquise por uma palavra-chave..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full py-4 pl-14 pr-6 text-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                {loading ? <div className="flex justify-center items-center py-10"><SpinnerIcon className="w-8 h-8" /> <span className="ml-3 text-lg">Buscando...</span></div> :
                 searchTerm.trim() !== '' ? (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Resultados da Pesquisa</h3>
                        {searchResults.length > 0 ? <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">{searchResults.map(q => <AccordionItem key={q.id} question={q} />)}</div> : <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum resultado.</p>}
                    </div>
                ) : selectedTheme ? (
                    <div>
                        <div className="flex items-center mb-6">
                            <button onClick={() => setSelectedTheme(null)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4">&larr; Voltar</button>
                            <h3 className="text-3xl font-bold">{selectedTheme}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">{displayedQuestions.map(q => <AccordionItem key={q.id} question={q} />)}</div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-center">Ou navegue por um tema</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {themes.map(theme => <button key={theme} onClick={() => setSelectedTheme(theme)} className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:-translate-y-1 transition-transform"><h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{theme}</h4></button>)}
                        </div>
                    </div>
                )}
            </main>
        </div>
        </>
    );
};

// --- COMPONENTE PRINCIPAL E ROTEAMENTO ---
const App = () => {
    const { isAuthenticated, user } = useAuth();
    const [viewAsUser, setViewAsUser] = useState(false);

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    if (user.role === 'admin' && !viewAsUser) {
        return <AdminDashboard onSwitchView={() => setViewAsUser(true)} />;
    }

    return <UserHome isAdminView={user.role === 'admin'} onSwitchView={() => setViewAsUser(false)} />;
};

export default function KnowledgeBaseApp() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    );
}
