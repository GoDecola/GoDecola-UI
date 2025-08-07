import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box, Typography, TextField, Button, Rating } from '@mui/material';
import { updateReview } from '../../../store/actions/reviewActions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(90vw, 500px)', 
    bgcolor: 'background.paper',
    border: 'none', 
    boxShadow: 24,
    p: 3, 
    borderRadius: '8px', 
    position: 'relative'
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

export const EditReviewModal = ({ isOpen, onRequestClose, review }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(review.rating || 0);
    const [comment, setComment] = useState(review.comment || '');

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
        }
    }, [review]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = { rating, comment };
        dispatch(updateReview({ reviewId: review.id, reviewData }));
        onRequestClose(); 
    };

    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            aria-labelledby="edit-review-modal-title"
        >
            <Box sx={style}>
                 <IconButton
                    aria-label="close"
                    onClick={onRequestClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="edit-review-modal-title" variant="h6" component="h2" sx={titleStyle}>
                    Editar Avaliação
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Box sx={ratingStyle}>
                        <Rating
                            name="rating"
                            value={rating}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="comment"
                        label="Seu comentário"
                        name="comment"
                        multiline
                        rows={3} 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={commentStyle}
                        inputProps={{ style: { fontSize: '1rem' } }} 
                        InputLabelProps={{ style: { fontSize: '1rem' } }} 
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={buttonStyle}
                    >
                        Salvar Alterações
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};