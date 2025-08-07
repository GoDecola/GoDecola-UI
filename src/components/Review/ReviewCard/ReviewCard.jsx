import './ReviewCard.css'
import useTimeAgo from '../../../hooks/useTimeAgo'
import useRandomAvatar from '../../../hooks/useRandomAvatar'
import Avatar from '@mui/joy/Avatar';
import RatingStars from '../RatingStars'
import ExpandableText from '../ExpandableText';

export const ReviewCard = ({ review, length }) => {
    const { id, reviewDate, rating, comment, packageId, user: { firstName, lastName, createdAt }} = review;

    const userName = `${firstName} ${lastName}`.trim();

    return (
        <div className='reviewCard'>

            <div className='reviewCardContent'>
                <div className='starRating'>
                    <RatingStars rating={rating} />
                    <p>• {useTimeAgo(reviewDate)} atrás</p>
                </div>

                <ExpandableText text={comment} maxLines={4} commentId={id} packageId={packageId} />

                <div className='reviewCard_user'>
                    <Avatar alt={userName} src={useRandomAvatar(userName)}
                        size="md"
                    />
                    <div className='reviewCard_userName'>
                        <h4 className='reviewCard_name' >{userName}</h4>
                        <p className='reviewCard_time' >{useTimeAgo(createdAt)} no Go Decola</p>
                    </div>
                </div>

            </div>
            {length > 1 && <hr />}
        </div>
    )
}
