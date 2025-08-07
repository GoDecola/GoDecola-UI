import './ReviewCard.css'
import useTimeAgo from '../../../hooks/useTimeAgo'
import useRandomAvatar from '../../../hooks/useRandomAvatar'
import Avatar from '@mui/joy/Avatar';
import RatingStars from '../RatingStars'
import ExpandableText from '../ExpandableText';
import { useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import { EditReviewModal } from '../EditReviewModal/EditReviewModal';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const ReviewCard = ({ review, length }) => {

    const { id, reviewDate, rating, comment, packageId, isEdited, user: {firstName, lastName, createdAt}, userId } = review;
    const userName = `${firstName} ${lastName}`.trim();

    const loggedInUserId = useSelector(state => state.auth.user?.id);
    const isOwner = loggedInUserId === userId;
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
        handleMenuClose();
    };

    return (
        <div className='reviewCard'>
            <EditReviewModal 
                isOpen={isEditModalOpen} 
                onRequestClose={() => setEditModalOpen(false)} 
                review={review} 
            />
            <ConfirmDeleteModal 
                isOpen={isDeleteModalOpen} 
                onRequestClose={() => setDeleteModalOpen(false)} 
                reviewId={id} 
            />

            <div className='reviewCardContent'>
                <div className='starRating'>
                    <RatingStars rating={rating} />
                    <p>
                        • {useTimeAgo(reviewDate)} atrás
                        {isEdited && <span className="edited_tag"> (editado)</span>}
                    </p>
                </div>

                <ExpandableText text={comment} maxLines={4} commentId={id} packageId={packageId} />

                <div className='reviewCard_user'>
                    <Avatar alt={userName} src={useRandomAvatar(userName)} size="md" />
                    <div className='reviewCard_userName'>
                        <h4 className='reviewCard_name'>{userName}</h4>
                        <p className='reviewCard_time'>{useTimeAgo(createdAt)} no Go Decola</p>
                    </div>

                    {isOwner && (
                        <div className="reviewCard_actions">
                            <IconButton
                                aria-label="mais opções"
                                id="long-button"
                                aria-controls={isMenuOpen ? 'long-menu' : undefined}
                                aria-expanded={isMenuOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleMenuClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    style: {
                                        backgroundColor: 'var(--surface-bg, #2d2d2d)',
                                        color: 'var(--primary-text-color, #ffffff)',
                                    },
                                }}
                            >
                                <MenuItem onClick={handleEdit}>
                                    <EditIcon sx={{ marginRight: 1 }} />
                                    Editar
                                </MenuItem>
                                <MenuItem onClick={handleDelete} sx={{ color: '#ff6b6b' }}>
                                    <DeleteOutlineIcon sx={{ marginRight: 1 }}/>
                                    Excluir
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </div>
            {length > 1 && <hr />}
        </div>
    );
}
