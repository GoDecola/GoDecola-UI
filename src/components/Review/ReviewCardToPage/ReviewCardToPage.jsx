import './ReviewCardToPage.css'
import useTimeAgo from '../../../hooks/useTimeAgo'
import useRandomAvatar from '../../../hooks/useRandomAvatar'
import Avatar from '@mui/joy/Avatar';
import RatingStars from '../RatingStars'

export const ReviewCardToPage = ({ review }) => {
    const { userName, review_date, rating, comment, userCreatedAt } = review;

    return (
        <div className='ReviewCardToPage'>

            <div className='reviewCard_user'>
                <Avatar alt={userName} src={useRandomAvatar(userName)}
                    size="md"
                />
                <div className='reviewCard_userName'>
                    <h4 className='reviewCard_name' >{userName}</h4>
                    <p className='reviewCard_time' >{useTimeAgo(userCreatedAt)} no Go Decola</p>
                </div>
            </div>

            <div className='starRating'>
                <RatingStars rating={rating} />
                <p>• {useTimeAgo(review_date)} atrás</p>
            </div>

            <p style={{ color: 'var(--text-footer)', marginLeft: '-5px' }}>{comment}</p>

        </div>
    )
}
