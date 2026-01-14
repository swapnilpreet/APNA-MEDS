import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminProtected = ({ children }) => {
  const { user } = useSelector((state) => state?.users);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  return user && user?.isAdmin ? <>{children}</> : null;
};

export default AdminProtected;
