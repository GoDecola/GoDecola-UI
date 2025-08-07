import { useState, useEffect } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { Modal, Box, Typography, TextField, Button, Rating } from '@mui/material';
import { createReview, updateReview } from '../../../store/actions/reviewActions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { clearReviewError } from '../../../store/slices/reviewSlice'; 

const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(90vw, 500px)', 
    bgcolor: 'background.paper',
    border: 'none', 
    boxShadow: 24,
    p: 3, 
    borderRadius: '8px', 
};

const buttonStyle = {
    mt: 2,
    mb: 1,
    padding: '0.7rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '6px',
    backgroundColor: 'var(--primary-color, #1976d2)', 
    color: 'white',
    '&:hover': {
        backgroundColor: 'var(--primary-color-darker, #1565c0)',
    },
};

const titleStyle = {
    textAlign: 'center',
    color: 'var(--secondary-color, #ff5722)', 
    marginBottom: '1.5rem', 
    padding: 0
};

const ratingStyle = {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
};

const commentStyle = {
    marginBottom: '1.5rem',
};

export const ReviewModal = ({ isOpen, onRequestClose, mode = 'add', review, travelPackageId }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.reviews);
    const [showError, setShowError] = useState(false);

    const isEditMode = mode === 'edit' && review;

    const [rating, setRating] = useState(isEditMode ? review.rating : 0);
    const [comment, setComment] = useState(isEditMode ? review.comment : '');

    useEffect(() => {
        if (isOpen) {
            setRating(isEditMode ? review.rating : 0);
            setComment(isEditMode ? review.comment : '');
        }
    }, [isOpen, isEditMode, review]);

    useEffect(() => {
        if (error) {
            setShowError(true);
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = { rating, comment };

        if (isEditMode) {
            dispatch(updateReview({ reviewId: review.id, reviewData }));
        } else {
            dispatch(createReview({ reviewData: { ...reviewData, travelPackageId } }));
        }

        if (actionResult.meta.requestStatus === 'fulfilled') {
            onRequestClose();
        }
        
        onRequestClose();
    };

        const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowError(false);
        dispatch(clearReviewError()); 
    };
    
    const modalTitle = isEditMode ? 'Editar Avaliação' : 'Adicionar Avaliação';
    const buttonText = isEditMode ? 'Salvar Alterações' : 'Enviar Avaliação';

    return (
        <>
            <Modal open={isOpen} onClose={onRequestClose}>
                <Box sx={style}>
                    <IconButton
                        onClick={onRequestClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {/* ALTERADO: Aplicado o titleStyle */}
                    <Typography variant="h6" component="h2" sx={titleStyle}>
                        {modalTitle}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        {/* ALTERADO: Aplicado o ratingStyle */}
                        <Box sx={ratingStyle}>
                            <Rating
                                name="rating"
                                value={rating}
                                precision={0.5}
                                onChange={(event, newValue) => setRating(newValue)}
                            />
                        </Box>
                        {/* ALTERADO: Aplicado o commentStyle */}
                        <TextField
                            required
                            fullWidth
                            label="O seu comentário"
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={commentStyle}
                        />
                        {/* ALTERADO: Aplicado o buttonStyle */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={buttonStyle}
                            disabled={!rating || !comment || loading}
                        >
                            {loading ? 'Enviando...' : buttonText}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {typeof error === 'string' ? error : 'Ocorreu um erro inesperado.'}
                </Alert>
            </Snackbar>
        </>
    );
};