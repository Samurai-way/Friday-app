import React from 'react'
import { useAppDispatch, useAppSelector } from 'redux/store'
import { setSortCardsAC } from 'redux/cardsReducer'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { CardRow, PackType } from './CardRow'
import { SortingColumnHead } from './SortingColumnHead'
import {Link, Navigate} from "react-router-dom";
import {Path} from "../app/AppRoutes";

type TablePropsType<T> = {
    packId: string
    rows: T[]
}

export const CardsTable: React.FC<TablePropsType<PackType>> = ({ rows, packId }) => {
    const dispatch = useAppDispatch()
    const sortCards = useAppSelector((state) => state.cards.sortCards)

    const onChangeSortHandler = (sortingName: string) => {
        const sortCode = sortCards?.slice(0, 1)
        const sortName = sortCards?.slice(1)
        let newSortCards
        if (sortName === sortingName) {
            const newSortCode = sortCode === '0' ? '1' : '0'
            newSortCards = newSortCode + sortName
        } else {
            newSortCards = '0' + sortingName
        }
        dispatch(setSortCardsAC(newSortCards))
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="pack table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#EFEFEF' }}>
                        <TableCell>
                            <Link style={{textDecoration: 'none', color: 'black'}} to={Path.learnPack}>Question</Link>
                        </TableCell>
                        <TableCell align="center">Answer</TableCell>
                        <SortingColumnHead
                            caption={'Last Updated'}
                            sortName={'updated'}
                            align="center"
                            sort={sortCards}
                            onChangeSort={onChangeSortHandler}
                        />
                        <SortingColumnHead
                            caption={'Grade'}
                            sortName={'grade'}
                            align="right"
                            sort={sortCards}
                            onChangeSort={onChangeSortHandler}
                        />
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <CardRow key={row.id} packId={packId} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
