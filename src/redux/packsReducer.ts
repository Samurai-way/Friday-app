import { Dispatch } from 'redux'
import { AppDispatch, AppRootReducerType } from './store'
import { RequestStatus, setErrorAC, setLoadingAC } from './appReducer'
import { packsCardApi } from 'api/packsCardApi'
import { CardPackType, ChangePackCardType, CreatePackCardType, PacksCardType } from '../api/types'
import { fetchCardsTC } from './cardsReducer'
import { ErrorResponseType } from '../api/responseParsers'
import { setIsLoginAC } from './authReducer'

export type PacksActionsType =
    | ReturnType<typeof setPacksCardAC>
    | ReturnType<typeof setPageCountAC>
    | ReturnType<typeof setPageAC>
    | ReturnType<typeof sortPacksAC>
    | ReturnType<typeof setMinMaxValueAC>
    | ReturnType<typeof setPackNameAC>
    | ReturnType<typeof setShowPacksCards>
    | ReturnType<typeof setIsInitializedSlider>

export type PacksCardParamsType = {
    packName?: string
    min?: number
    max?: number
    sortPacks?: string
    page?: number
    pageCount?: number
    user_id?: string
    block?: boolean
}

type initialStateType = typeof initialState

const initialState = {
    whosePackCard: 'All' as 'All' | 'My',
    packName: '',
    cardPacks: [] as Array<CardPackType>,
    cardPacksTotalCount: 0,
    maxCardsCount: 0,
    minCardsCount: 0,
    page: 1,
    pageCount: 5,
    sortPacks: '0updated',
    slider: {
        isInitializedSlider: false,
        max: 0,
        min: 0,
    },
}

export const packsReducer = (
    state: initialStateType = initialState,
    action: PacksActionsType
): initialStateType => {
    switch (action.type) {
        case 'PACKS/SET-PACKS-CARD': {
            return { ...state, ...action.packsCard }
        }
        case 'PACKS/SET-PAGE-COUNT': {
            return { ...state, pageCount: action.pageCount }
        }
        case 'PACKS/SET-PAGE': {
            return { ...state, page: action.newPage }
        }
        case 'PACKS/SORT-PACKS': {
            return { ...state, sortPacks: action.valueSort }
        }
        case 'PACKS/SET-MIN-MAX-VALUE': {
            return {
                ...state,
                slider: { ...state.slider, min: action.minValue, max: action.maxValue },
            }
        }
        case 'PACKS/SET-PACK-NAME': {
            return {
                ...state,
                packName: action.name,
            }
        }
        case 'PACKS/SET-SHOW-PACK-CARDS': {
            return { ...state, whosePackCard: action.statusPack }
        }
        case 'PACKS/SET-IS-INITIALIZED-SLIDER': {
            return {
                ...state,
                slider: { ...state.slider, isInitializedSlider: action.statusSlider },
            }
        }
        default: {
            return state
        }
    }
}

export const setPacksCardAC = (packsCard: PacksCardType) => {
    return { type: 'PACKS/SET-PACKS-CARD', packsCard } as const
}
export const setPageCountAC = (pageCount: number) => {
    return { type: 'PACKS/SET-PAGE-COUNT', pageCount } as const
}
export const setPageAC = (newPage: number) => {
    return { type: 'PACKS/SET-PAGE', newPage } as const
}
export const sortPacksAC = (valueSort: string) => {
    return { type: 'PACKS/SORT-PACKS', valueSort } as const
}
export const setMinMaxValueAC = (minValue: number, maxValue: number) => {
    return { type: 'PACKS/SET-MIN-MAX-VALUE', minValue, maxValue } as const
}
export const setPackNameAC = (name: string) => {
    return { type: 'PACKS/SET-PACK-NAME', name } as const
}
export const setShowPacksCards = (statusPack: 'All' | 'My') => {
    return { type: 'PACKS/SET-SHOW-PACK-CARDS', statusPack } as const
}
export const setIsInitializedSlider = (statusSlider: boolean) => {
    return { type: 'PACKS/SET-IS-INITIALIZED-SLIDER', statusSlider } as const
}

export const getPacksCardTC =
    (activeDefaultValue?: boolean) =>
    async (dispatch: Dispatch, getState: () => AppRootReducerType) => {
        let params: PacksCardParamsType = {}

        if (!activeDefaultValue) {
            const packs = getState().packsCard
            params = {
                packName: packs.packName,
                min: packs.slider.min,
                max: packs.slider.max,
                page: packs.page,
                pageCount: packs.pageCount,
                sortPacks: packs.sortPacks,
                user_id: packs.whosePackCard === 'My' ? getState().auth.profileData.id : '',
            }
        }

        try {
            dispatch(setLoadingAC(RequestStatus.loading))
            const result = await packsCardApi.getPacksCard(params)
            if (activeDefaultValue) {
                dispatch(setMinMaxValueAC(0, 0))
                dispatch(setPackNameAC(''))
                dispatch(sortPacksAC('0updated'))
                dispatch(setShowPacksCards('All'))
            } else {
                dispatch(setPacksCardAC(result as PacksCardType))
            }
        } catch (error) {
            const { status, message } = error as ErrorResponseType
            dispatch(setErrorAC(message))
            if (status === 401) dispatch(setIsLoginAC(false))
            dispatch(setLoadingAC(RequestStatus.error))
        } finally {
            dispatch(setLoadingAC(RequestStatus.succeeded))
        }
    }

export const createPackTC = (payload: CreatePackCardType) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        await packsCardApi.createPackCard(payload)
        await dispatch(getPacksCardTC())
        dispatch(setLoadingAC(RequestStatus.succeeded))
    } catch (error) {
        const { status, message } = error as ErrorResponseType
        dispatch(setErrorAC(message))
        if (status === 401) dispatch(setIsLoginAC(false))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.succeeded))
    }
}

export const deletePackTC = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        await packsCardApi.deletePackCard(id)
        await dispatch(getPacksCardTC())
        dispatch(setLoadingAC(RequestStatus.succeeded))
    } catch (error) {
        const { status, message } = error as ErrorResponseType
        dispatch(setErrorAC(message))
        if (status === 401) dispatch(setIsLoginAC(false))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.succeeded))
    }
}

export const changePackTC =
    (payload: ChangePackCardType, isFetchCards: boolean = false) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoadingAC(RequestStatus.loading))
            await packsCardApi.changePackCard(payload)
            if (isFetchCards) await dispatch(fetchCardsTC(payload._id))
            else await dispatch(getPacksCardTC())
            dispatch(setLoadingAC(RequestStatus.succeeded))
        } catch (error) {
            const { status, message } = error as ErrorResponseType
            dispatch(setErrorAC(message))
            if (status === 401) dispatch(setIsLoginAC(false))
            dispatch(setLoadingAC(RequestStatus.error))
        } finally {
            dispatch(setLoadingAC(RequestStatus.succeeded))
        }
    }
