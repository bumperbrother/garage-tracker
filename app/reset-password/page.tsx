'use client';

import React from 'react';
import AuthForm from '../../components/auth/AuthForm';
import Layout from '../../components/layout/Layout';

export default function ResetPasswordPage() {
  return (
    <Layout>
      <AuthForm type="reset-password" />
    </Layout>
  );
}
