import { api } from "./api";

type AuthResponse = {
    erro: number;
    msg: string;
    result: any;
}

class MessageService {
    async send(text: string) {
        //console.log(api.defaults.headers.common.authorization);
        const response = await api.post<AuthResponse>('messages', {
            text: text
        });

        const { erro, msg, result } = response.data;
        
        if(erro !== 0) {
            return null;
        }
        return result;
    }
}

export { MessageService }
