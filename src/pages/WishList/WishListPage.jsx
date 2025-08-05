import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../store/actions/wishlistAction';
import './WishListPage.css';

export default function WishListPage() {
  const dispatch = useDispatch();
  const { items: wishlists, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleDelete = async (id) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="wish-container">
      <h1 className="wish-title">Minha Lista de Desejos</h1>
      {loading ? (
        <div className="wish-empty-state">
          <h3>Carregando...</h3>
        </div>
      ) : error ? (
        <div className="wish-empty-state">
          <h3>Erro ao carregar lista de desejos</h3>
          <p>{error}</p>
        </div>
      ) : wishlists.length === 0 ? (
        <div className="wish-empty-state">
          <h3>Sua lista de desejos está vazia</h3>
          <p>Adicione pacotes de viagem à sua wishlist para vê-los aqui!</p>
        </div>
      ) : (
        <div className="wish-list">
          {wishlists.map((item) => (
            <div key={item.id} className="wish-item">
              <h3>{item.title}</h3>
              <button 
                className="wish-delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                Remover da Lista
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}