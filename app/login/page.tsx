'use client';

import React from 'react';
import AuthForm from '../../components/auth/AuthForm';
import Layout from '../../components/layout/Layout';

export default function LoginPage() {
  return (
    <Layout>
      <AuthForm type="login" />
    </Layout>
  );
}
