import './AllReviewsPage.css'
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ReviewCardToPage } from '../../components/Review/ReviewCardToPage/ReviewCardToPage';
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { goBack } from '../../routes/coordinator';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviewsByPackageId } from '../../store/actions/reviewActions';
import { selectTransformedReviews } from '../../store/slices/reviewSlice';

const AllReviewsPage = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();
    const reviewRefs = useRef({});

    const reviews = useSelector(selectTransformedReviews);
    const { loading, error } = useSelector(state => state.reviews);

    const queryParams = new URLSearchParams(location.search);
    const packageId = queryParams.get('packageId');
    const highlightId = queryParams.get('highlightId');

    useEffect(() => {
        if (packageId) {
            dispatch(fetchReviewsByPackageId(packageId));
        }
    }, [dispatch, packageId]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (highlightId && highlightId !== "0" && reviewRefs.current[highlightId]) {
                reviewRefs.current[highlightId].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [highlightId, reviews]);

    if (loading) {
        return <Typography>Carregando avaliações...</Typography>;
    }

    if (error) {
         return <Typography>Erro ao carregar avaliações.</Typography>;
    }


    return (
        <div className='AllReviewsContainer'>
            <Box sx={{ p: 3, maxWidth: '800px', margin: 'auto' }}>
                {reviews.length > 0 ? (
                    <>
                        <div className="allReviews_Title">

                            <FaArrowLeft className='allReviews_Title_arrow' onClick={() => goBack(navigate)} />

                            <div className='allComments'>
                                {reviews.length === 1 ? 'Comentário' : `Todos os ${reviews.length} comentários`}
                            </div>
                        </div>

                        {reviews.map(review => (
                            <Box
                                key={review.id}

                                ref={el => {
                                    if (el) {
                                        reviewRefs.current[review.id] = el;
                                    } else {
                                        delete reviewRefs.current[review.id];
                                    }
                                }}
                                sx={{
                                    border: highlightId === String(review.id) && highlightId !== "0"
                                            ? '2px solid var(--orange-avanade)'
                                            : '1px solid var(--icons-login-hover)',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    p: 1,
                                    backgroundColor: 'var(--footer-bg)',
                                }}
                            >
                                <ReviewCardToPage review={review} />
                            </Box>
                        ))}
                    </>
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: 'var(--primary-text-color)' }}>
                        Nenhuma avaliação encontrada para este pacote.
                    </Typography>
                )}
            </Box>
        </div>
    );
};

export default AllReviewsPage;