import { api } from "./api";

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthResponse = {
    erro: number;
    msg: string;
    result: any;
}

class SignInService {
    async signInWithGithub(code: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: code
        });

        const { erro, msg, result } = response.data;
        
        if(erro !== 0) {
            return null;
        }
        return result;
    }

    async getUser(token: string) {
        //passa o token no header de todas as consultas a partir daqui
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        
        const response = await api.get<AuthResponse>('profile');
        const { erro, msg, result } = response.data;
        
        if(erro !== 0) {
            return null;
        }
        return result;
    }
}
export { SignInService }
