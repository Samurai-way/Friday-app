import { instance } from './instance'
import {
    getDataFromAxiosResponse,
    parseAxiosError,
    parseLoginResponse,
    parseLogoutResponse,
    parseSingUpResponse,
    parseUpdatedUserResponse,
} from './responseParsers'
import { PacksCardParamsType } from '../redux/packsReducer'

export const authApi = {
    singUp(dataForm: DataFormType) {
        return instance
            .post<SingUpResponseType>('/auth/register', dataForm)
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
            .then(parseSingUpResponse)
    },

    login(data: LoginDataType) {
        return instance
            .post<LoginResponseType>('/auth/login', data)
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
            .then(parseLoginResponse)
    },

    forgotPass(email: RecoveryEmailType) {
        return instance.post<ResponseForgotPasswordType>('/auth/forgot', {
            email: email.email,
            message: `<div style="background-color: #f7f7f7; padding: 15px">
                        Follow
                        <a href='https://Samurai-way.github.io/Friday-app/#/set-new-password/$token$'
                        style="font-weight: bold; color: #1a73e8;">
                        this link</a> to recover your password
                        </div>`, // html-письмо, вместо $token$ бэк вставит токен
        })
    },

    setNewPassword({ password, resetPasswordToken }: SetNewPasswordType) {
        return instance.post<ResponseSetNewPasswordType>('/auth/set-new-password', {
            password,
            resetPasswordToken,
        })
    },

    changeUserNameOrAvatar(data: { name?: string; avatar?: string }) {
        return instance
            .put('/auth/me', data)
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
            .then(parseUpdatedUserResponse)
    },

    me() {
        return instance
            .post<LoginResponseType>('auth/me')
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
            .then(parseLoginResponse)
    },

    logout() {
        return instance
            .delete<LogoutResponseType>('auth/me')
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
            .then(parseLogoutResponse)
    },
}

export const packsCardApi = {
    getPacksCard(params: PacksCardParamsType) {
        return instance
            .get<PacksCardType>('/cards/pack', { params })
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
    },
    createPackCard(payload: createPackCardType) {
        return instance
            .post('/cards/pack', { cardsPack: payload })
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
    },
    deletePackCard(id: string) {
        return instance
            .delete(`/cards/pack?id=${id}`)
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
    },
}

export const cardsApi = {
    getCards(params: GetCardsParamsType) {
        return instance
            .get<CardsStateType>(`/cards/card`, { params })
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
    },
}

export const decksApi = {
    setCards(
        packId: string,
        question?: string,
        answer?: string,
        min?: string,
        max?: string,
        page?: number,
        pageCount?: number
    ) {
        return instance
            .get(`/cards/card`, {
                params: {
                    cardsPack_id: packId,
                    cardQuestion: question,
                    cardAnswer: answer,
                    min,
                    max,
                    page,
                    pageCount,
                },
            })
            .then(getDataFromAxiosResponse)
            .catch(parseAxiosError)
        // .then(parseLogoutResponse)
    },
}


//==TYPES=======================================================================

export type RecoveryEmailType = {
    email: string
}

export type CardPackType = {
    _id: string
    user_id: string
    name: string
    cardsCount: number
    created: string
    updated: string
    user_name: string
}
export type PacksCardType = {
    cardPacks: Array<CardPackType>
    cardPacksTotalCount: number
    maxCardsCount: number
    minCardsCount: number
    page: number
    pageCount: number
}
export type createPackCardType = {
    name?: string
    deckCover?: string
    private?: boolean
}
export type DataFormType = {
    email?: string
    password?: string
    currPassword?: string
}

export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

export type SingUpResponseType = {
    addedUser: {}
    error?: string
}

export type LoginResponseType = ProfileDataType & {
    _id: string
    isAdmin: boolean
    verified: boolean // подтвердил ли почту
    rememberMe: boolean
    token: string
    tokenDeathTime: number
    created: Date
    updated: Date
    publicCardPacksCount: number // количество колод
    error?: string
}

export type ProfileDataType = {
    id: string
    email: string
    name: string
    avatar?: string
}

export type LogoutResponseType = {
    info: string
    error: string
}
export type SetNewPasswordType = {
    password: string
    resetPasswordToken: string
}

export type ResponseForgotPasswordType = {
    info: string
    success: boolean
}
export type ResponseSetNewPasswordType = {
    info: string
    error: string
}

export type GetCardsParamsType = {
    cardsPack_id: string
    cardAnswer?: string
    cardQuestion?: string
    min?: number
    max?: number
    sortCards?: string
    page?: number
    pageCount?: number
}

export type CardType = {
    answer: string
    question: string
    cardsPack_id: string
    grade: number
    shots: number
    user_id: string
    created: string
    updated: string
    _id: string
}

export type CardsStateType = {
    cards: Array<CardType>
    cardsTotalCount: number
    maxGrade: number
    minGrade: number
    page: number
    pageCount: number
    packUserId: string
}
