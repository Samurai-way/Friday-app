import { Dispatch } from 'redux'
import {
    DataFormType,
    LoginDataType,
    ProfileDataType,
    RecoveryEmailType,
    SetNewPasswordType,
} from 'api/types'
import { RequestStatus, setErrorAC, setInfoAC, setLoadingAC } from './appReducer'
import { authApi } from 'api/authApi'
import { getBase64 } from '../utils'
import { ErrorResponseType } from '../api/responseParsers'

//===TYPES======================================================================

export type AuthActionsType =
    | ReturnType<typeof setSingUpAC>
    | ReturnType<typeof setIsLoginAC>
    | ReturnType<typeof getEmailForgotPassAC>
    | ReturnType<typeof setProfileDataAC>
    | ReturnType<typeof getVerificationEmailAC>
    | ReturnType<typeof setNewPasswordAC>
    | ReturnType<typeof changePasswordAC>

type InitialStateType = typeof initialState

//===REDUCER====================================================================

const initialState = {
    isSingUp: false,
    isLogin: false,
    forgotPass: { email: '', password: '', passChanged: '', verificationEmail: false },
    profileData: { email: '', name: '', id: '' } as ProfileDataType, // avatar: undefined
}

export const authReducer = (
    state: InitialStateType = initialState,
    action: AuthActionsType
): InitialStateType => {
    switch (action.type) {
        case 'AUTH/SET-SIGN-UP': {
            return { ...state, isSingUp: action.statusSingUp }
        }
        case 'AUTH/SET-IS-LOGIN':
            return {
                ...state,
                isLogin: action.isLogin,
            }
        case 'AUTH/SET-PROFILE-DATA':
            return {
                ...state,
                profileData: action.profileData,
            }
        case 'FORGOT-PASS/GET-EMAIL': {
            return { ...state, forgotPass: { ...state.forgotPass, email: action.email } }
        }
        case 'FORGOT-PASS/VERIFICATION-EMAIL': {
            return {
                ...state,
                forgotPass: { ...state.forgotPass, verificationEmail: action.verificationEmail },
            }
        }
        case 'FORGOT-PASS/SET-NEW-PASSWORD': {
            return { ...state, forgotPass: { ...state.forgotPass, password: action.password } }
        }
        case 'FORGOT-PASS/CHANGE-PASSWORD': {
            return {
                ...state,
                forgotPass: { ...state.forgotPass, passChanged: action.passChanged },
            }
        }
        default: {
            return state
        }
    }
}

//===ACTIONS====================================================================

export const setSingUpAC = (statusSingUp: boolean) => {
    return { type: 'AUTH/SET-SIGN-UP', statusSingUp } as const
}

export const setIsLoginAC = (isLogin: boolean) => {
    return { type: 'AUTH/SET-IS-LOGIN', isLogin } as const
}

export const getEmailForgotPassAC = (email: string) => {
    return { type: 'FORGOT-PASS/GET-EMAIL', email } as const
}

export const setProfileDataAC = (profileData: ProfileDataType) => {
    return { type: 'AUTH/SET-PROFILE-DATA', profileData } as const
}

export const getVerificationEmailAC = (verificationEmail: boolean) => {
    return { type: 'FORGOT-PASS/VERIFICATION-EMAIL', verificationEmail } as const
}

export const setNewPasswordAC = (password: string) => {
    return { type: 'FORGOT-PASS/SET-NEW-PASSWORD', password } as const
}

export const changePasswordAC = (passChanged: string) => {
    return { type: 'FORGOT-PASS/CHANGE-PASSWORD', passChanged } as const
}

//===THUNKS=====================================================================

export const singUpTC = (value: DataFormType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        await authApi.singUp(value)
        dispatch(setSingUpAC(true))
        dispatch(setInfoAC('Are you registered'))
    } catch (error) {
        const { status, message } = error as ErrorResponseType
        dispatch(setErrorAC(message))
        if (status === 401) dispatch(setIsLoginAC(false))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.succeeded))
    }
}

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        const res = await authApi.login(data)
        dispatch(setProfileDataAC(res))
        dispatch(setInfoAC('logIn success'))
        dispatch(setIsLoginAC(true))
    } catch (error) {
        const { status, message } = error as ErrorResponseType
        dispatch(setErrorAC(message))
        if (status === 401) dispatch(setIsLoginAC(false))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.idle))
    }
}

export const forgotTC = (email: RecoveryEmailType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        const res = await authApi.forgotPass(email)
        dispatch(getEmailForgotPassAC(email.email))
        dispatch(getVerificationEmailAC((res as any).success))
        dispatch(setLoadingAC(RequestStatus.succeeded))
    } catch (error) {
        const { status, message } = error as ErrorResponseType
        dispatch(setErrorAC(message))
        if (status === 401) dispatch(setIsLoginAC(false))
        dispatch(setLoadingAC(RequestStatus.error))
    }
}

export const setNewPassTC =
    ({ password, resetPasswordToken }: SetNewPasswordType) =>
    async (dispatch: Dispatch) => {
        try {
            setLoadingAC(RequestStatus.loading)
            const response = await authApi.setNewPassword({
                password,
                resetPasswordToken,
            })
            const passChanged = response.data.info
            dispatch(setNewPasswordAC(password))
            dispatch(changePasswordAC(passChanged))
            dispatch(setInfoAC(passChanged))
            dispatch(setLoadingAC(RequestStatus.succeeded))
        } catch (error) {
            const { status, message } = error as ErrorResponseType
            dispatch(setErrorAC(message))
            if (status === 401) dispatch(setIsLoginAC(false))
            dispatch(setLoadingAC(RequestStatus.error))
        }
    }

export const changeProfileDataTC =
    ({ avatarFile, name }: { avatarFile?: File; name?: string }) =>
    async (dispatch: Dispatch) => {
        try {
            dispatch(setLoadingAC(RequestStatus.loading))
            let newProfileData = {}
            if (avatarFile) {
                const avatar = await getBase64(avatarFile)
                newProfileData = { ...newProfileData, avatar }
            }
            if (name) {
                newProfileData = { ...newProfileData, name }
            }
            const res = await authApi.changeUserNameOrAvatar(newProfileData)
            dispatch(setProfileDataAC(res))
            dispatch(setIsLoginAC(true))
        } catch (error) {
            const { status, message } = error as ErrorResponseType
            dispatch(setErrorAC(message))
            if (status === 401) dispatch(setIsLoginAC(false))
            dispatch(setLoadingAC(RequestStatus.error))
        } finally {
            dispatch(setLoadingAC(RequestStatus.idle))
        }
    }

export const logoutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        const res = await authApi.logout()
        dispatch(setInfoAC(res.info))
        dispatch(setIsLoginAC(false))
    } catch (error) {
        const { status, message } = error as ErrorResponseType
        dispatch(setErrorAC(message))
        if (status === 401) dispatch(setIsLoginAC(false))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.idle))
    }
}
