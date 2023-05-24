import Navbar from '@/component/Navbar';
import { Container, Card, Grid, MenuItem, TextField, Typography, Box, Button } from '@mui/material'
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';



const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];

function Bridge() {
    return (
        <>
            <Container sx={{ background: 'transparent', mt: 10 }}>

                <Card sx={{ border: 1, borderColor: 'blue', backgroundColor: 'transparent', borderRadius: 5 }}>

                    <Typography variannt='h6' sx={{ color: 'white', fontSize: '30px', textAlign: 'center' }}> Bridge Asset</Typography>

                    {/* 1st row */}

                    <Grid container sx={{ paddingTop: 3 }}>

                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}> From (Source)</Typography>

                                <TextField

                                    id="filled-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    variant="filled"
                                    sx={{ border: 1, borderColor: 'white', borderRadius: 3, width: 400, height: 50, paddingTop: 2 }}
                                >
                                    {/* {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                    </MenuItem>
                                      ))} */}
                                </TextField>
                            </Box>


                        </Grid>
                        <Grid xs={2} sx={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
                            <SwapHorizontalCircleIcon sx={{ color: 'white', fontSize: 50 }} />
                        </Grid>
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>To (Destination)</Typography>

                                <TextField

                                    id="filled-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    variant="filled"
                                    sx={{ border: 1, borderColor: 'white', borderRadius: 3, width: 400, height: 50, paddingTop: 2 }}
                                >
                                    {/* {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                    </MenuItem>
                                      ))} */}
                                </TextField>
                            </Box>
                        </Grid>

                    </Grid>
                    {/* 2nd row */}

                    <Grid container sx={{ paddingTop: 3 }}>
                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }} >
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Assets (You had like to bridge)</Typography>

                                <TextField

                                    id="filled-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    variant="filled"
                                    sx={{ border: 1, borderColor: 'white', borderRadius: 3, width: 400, height: 50, paddingTop: 2 }}
                                >
                                    {/* {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                    </MenuItem>
                                      ))} */}
                                </TextField>
                            </Box>
                        </Grid>
                        <Grid xs={2}>

                        </Grid>
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Amount</Typography>

                                <TextField

                                    id="filled-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    variant="filled"
                                    sx={{ border: 1, borderColor: 'white', borderRadius: 3, width: 400, height: 50, paddingTop: 2 }}
                                >
                                    {/* {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                    </MenuItem>
                                      ))} */}
                                </TextField>
                            </Box>
                        </Grid>

                    </Grid>


                    {/* 3rd row */}

                    <Grid container sx={{ paddingTop: 3 }}>
                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Relayer </Typography>

                                <TextField

                                    id="filled-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    variant="filled"
                                    sx={{ border: 1, borderColor: 'white', borderRadius: 3, width: 400, height: 50, paddingTop: 2 }}
                                >
                                    {/* {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                    </MenuItem>
                                      ))} */}
                                </TextField>
                            </Box>
                        </Grid>
                        <Grid xs={2}>

                        </Grid>
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Destination</Typography>

                                <TextField

                                    id="filled-select-currency"
                                    select
                                    label="Select"
                                    defaultValue="EUR"
                                    variant="filled"
                                    sx={{ border: 1, borderColor: 'white', borderRadius: 3, width: 400, height: 50, paddingTop: 2 }}
                                >
                                    {/* {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                    </MenuItem>
                                      ))} */}
                                </TextField>
                            </Box>
                        </Grid>

                    </Grid>


                    {/* 4th row */}

                    <Grid container sx={{ paddingTop: 3 }}>
                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                <WarningAmberIcon sx={{ color: 'red', fontSize: 30 }} />
                                <Typography sx={{ color: 'white' }}>Bridge charges 0.07% upon every transection </Typography>

                            </Box>

                        </Grid>
                        <Grid xs={2}>

                        </Grid>
                        <Grid item xs={5}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 }, textAlign: 'end' }} />
                                <Typography sx={{ color: 'white' }}>Accept</Typography>
                            </Box>

                        </Grid>

                    </Grid>


                    <Box sx={{ textAlign: 'center', paddingY: 5 }}>
                        <Button variant='contained' sx={{
                            width: 350,
                            textAlign: 'center',
                            backgroundColor: 'transparent',
                            border: 1,
                            borderColor: 'white'
                        }}>Bridge Token</Button>
                    </Box>




                </Card>
            </Container>
        </>
    )
}

export default Bridge