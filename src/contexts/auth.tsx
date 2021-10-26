import { createContext, ReactNode, useState, useEffect } from "react";

import { SignInService } from "../services/SignInService";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

type AuthProvider = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);
    const service = new SignInService();
    const GITHUB_CLIENT_ID = 'c260fc984e777d7e99f0';
    const signInUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`;

    function signOut() {
        setUser(null);
        localStorage.removeItem('@nlwheat:token');
    }

    useEffect(() => {
        //obtem o token
        const token = localStorage.getItem('@nlwheat:token');

        if(token) {
            service.getUser(token).then(response => {
                if(response) {
                    setUser(response);
                }
            });
        }
    }, []);

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code');
        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=');
            window.history.pushState({}, '', urlWithoutCode);
    
            service.signInWithGithub(githubCode).then(response => {
                if(response) {
                    //armazena o token
                    localStorage.setItem('@nlwheat:token', response.token);
                    //atualiza o user
                    setUser(response.user);
                }
            });
        }
    }, []);
    
    return (
        <AuthContext.Provider value={{user, signInUrl, signOut}}>
            {props.children}
        </AuthContext.Provider>
    );
}
