import { useDispatch } from 'react-redux';
import { Modal, Box, Typography, Button } from '@mui/material';
import { deleteReview } from '../../../store/actions/reviewActions';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

export const ConfirmDeleteModal = ({ isOpen, onRequestClose, reviewId }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteReview(reviewId));
        onRequestClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            aria-labelledby="confirm-delete-modal-title"
        >
            <Box sx={style}>
                <Typography id="confirm-delete-modal-title" variant="h6" component="h2">
                    Confirmar Exclusão
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Tem a certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                    <Button variant="outlined" onClick={onRequestClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Excluir
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};