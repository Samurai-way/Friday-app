import { Dispatch } from 'redux'
import { CardPackType, createPackCardType, packsCardApi, PacksCardType } from 'api/api'
import { AppDispatch, AppRootReducerType } from './store'
import { RequestStatus, setErrorAC, setLoadingAC } from './appReducer'

type PacksActionsType =
    | ReturnType<typeof setPacksCardAC>
    | ReturnType<typeof setPageCountAC>
    | ReturnType<typeof setPageAC>
    | ReturnType<typeof sortPacksAC>
    | ReturnType<typeof setMinMaxValueAC>
    | ReturnType<typeof setPackNameAC>

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
    packName: '',
    cardPacks: [] as Array<CardPackType>,
    cardPacksTotalCount: 0,
    maxCardsCount: 0,
    minCardsCount: 0,
    page: 1,
    pageCount: 10,
    sortPacks: '0updated',
    slider: {
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
            let copyState = { ...state }
            if (state.slider.max === 0) {
                copyState.slider.max = action.packsCard.maxCardsCount
            }
            return {
                ...copyState,
                ...action.packsCard,
            }
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
                slider: { min: action.minValue, max: action.maxValue },
            }
        }
        case 'PACKS/SET-PACK-NAME': {
            return {
                ...state,
                packName: action.name,
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

export const getPacksCardTC =
    () => async (dispatch: Dispatch, getState: () => AppRootReducerType) => {
        const packs = getState().packsCard
        let params: PacksCardParamsType = {
            packName: packs.packName,
            min: packs.slider.min,
            max: packs.slider.max,
            page: packs.page,
            pageCount: packs.pageCount,
            sortPacks: packs.sortPacks,
        }
        try {
            dispatch(setLoadingAC(RequestStatus.loading))
            const result = await packsCardApi.getPacksCard(params)
            dispatch(setPacksCardAC(result))
        } catch (e) {
            dispatch(setErrorAC(e as string))
            dispatch(setLoadingAC(RequestStatus.error))
        } finally {
            dispatch(setLoadingAC(RequestStatus.succeeded))
        }
    }

export const createPackTC = (payload: createPackCardType) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        await packsCardApi.createPackCard(payload)
        await dispatch(getPacksCardTC())
        dispatch(setLoadingAC(RequestStatus.succeeded))
    } catch (e) {
        dispatch(setErrorAC(e as string))
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
    } catch (e) {
        dispatch(setErrorAC(e as string))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.succeeded))
    }
}

export const changePackTC = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoadingAC(RequestStatus.loading))
        await packsCardApi.changePackCard(id)
        await dispatch(getPacksCardTC())
        dispatch(setLoadingAC(RequestStatus.succeeded))
    } catch (e) {
        dispatch(setErrorAC(e as string))
        dispatch(setLoadingAC(RequestStatus.error))
    } finally {
        dispatch(setLoadingAC(RequestStatus.succeeded))
    }
}
