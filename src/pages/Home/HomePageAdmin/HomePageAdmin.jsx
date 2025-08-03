import './HomePageAdmin.css'
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material'
import  BookingsAdminTable from '../../../components/Admin/BookingsAdminTable/BookingsAdminTable'
import { UsersAdminTable } from '../../../components/Admin/UsersAdminTable/UsersAdminTable'
import { ReviewsAdminTable } from '../../../components/Admin/ReviewsAdminTable/ReviewsAdminTable'
import { PackagesAdminTable } from '../../../components/Admin/PackagesAdminTable/PackagesAdminTable'
import { SalesMetrics } from '../../../components/Admin/SalesMetrics/SalesMetrics'
import useIsMobile from '../../../hooks/useIsMobile';

const HomePageAdmin = () => {
    const [selectedSection, setSelectedSection] = useState('');
    const [showMetrics, setShowMetrics] = useState(false);
    const isMobile = useIsMobile()

    const handleManageChange = (event) => {
        const value = event.target.value;
        setSelectedSection(value);
        setShowMetrics(false);
    };

    const handleMetricsButtonClick = () => {
        setShowMetrics(true);
        setSelectedSection('');
    };

    const renderContent = () => {
        if (showMetrics) {
            return <SalesMetrics />;
        }
        switch (selectedSection) {
            case 'packages':
                return <PackagesAdminTable />;
            case 'bookings':
                return <BookingsAdminTable />;
            case 'clients':
                return <UsersAdminTable />;
            case 'comments':
                return <ReviewsAdminTable />;
            default:
                return (
                    <Typography variant="h6" sx={{ mt: 3, textAlign: 'center', color: 'var(--primary-text-color)' }}>
                        Selecione uma opção para gerenciar ou clique em "Ver métricas".
                    </Typography>
                );
        }
    };

    return (
        <div className='homepageAdmin-container'
            style={{
                padding: isMobile ? '0px 0px 30px' : '40px 50px 30px'
            }}>
            <Box sx={{
                width: 'auto',
                mb: 4,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                mt: isMobile ? 4 : 0,
                ml: isMobile ? 'auto' : 0,
                mr: isMobile ? 'auto' : 0,
            }}>

                <FormControl sx={{ flexGrow: 1, width: '150px' }}>
                    <InputLabel id="manage-label" sx={{
                        color: 'var(--text-footer)',
                        transition: 'none',
                        '&.Mui-focused': {
                            color: 'var(--orange-avanade)',
                        },
                    }}>
                        Gerenciar
                    </InputLabel>
                    <Select
                        labelId="manage-label"
                        id="admin-management-select"
                        value={selectedSection}
                        label="Gerenciar"
                        onChange={handleManageChange}
                        sx={{
                            color: 'var(--orange-avanade)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--no-active-tab)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--no-active-tab)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--orange-avanade)',
                            },
                            '&.Mui-focused .MuiInputLabel-root': {
                                color: 'var(--no-active-tab)',
                            },
                            '& .MuiSelect-icon': {
                                color: !showMetrics ? 'var(--orange-avanade)' : 'var(--no-active-tab)'
                            }

                        }}
                    >
                        <MenuItem
                            value={'packages'}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--orange-avanade)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'var(--orange-avanade)',
                                    },
                                },
                            }}
                        >
                            Pacotes
                        </MenuItem>
                        <MenuItem
                            value={'bookings'}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--orange-avanade)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'var(--orange-avanade)',
                                    },
                                },
                            }}
                        >
                            Reservas
                        </MenuItem>
                        <MenuItem
                            value={'clients'}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--orange-avanade)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'var(--orange-avanade)',
                                    },
                                },
                            }}
                        >
                            Clientes
                        </MenuItem>
                        <MenuItem
                            value={'comments'}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--orange-avanade)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'var(--orange-avanade)',
                                    },
                                },
                            }}
                        >
                            Comentários
                        </MenuItem>
                    </Select>
                </FormControl>


                <Button
                    variant="outlined"
                    onClick={handleMetricsButtonClick}
                    sx={{
                        width: '120px',
                        height: '55px',
                        textTransform: 'none',
                        transition: 'none',
                        color: showMetrics ? 'var(--orange-avanade)' : 'var(--text-footer)',
                        borderColor: showMetrics ? 'var(--orange-avanade)' : 'var(--no-active-tab)',
                        '&:hover': {
                            color: 'var(--orange-avanade)',
                            borderColor: 'var(--orange-avanade)',
                            backgroundColor: 'var(--icons-login-hover)',
                        }
                    }}
                >
                    Ver métricas
                </Button>
            </Box>


            <Box sx={{
                p: isMobile ? 0: 3,
                border: isMobile ? 'none' : '1px solid var(--no-active-tab)'
                , borderRadius: '8px', height: '100%', width: '100%', backgroundColor: 'var(--footer-bg)'
            }}>
                {renderContent()}
            </Box>
        </div>
    );
};

export default HomePageAdmin;