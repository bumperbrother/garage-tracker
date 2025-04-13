'use client';

import React from 'react';
import AuthForm from '../../components/auth/AuthForm';
import Layout from '../../components/layout/Layout';

export default function SignupPage() {
  return (
    <Layout>
      <AuthForm type="signup" />
    </Layout>
  );
}
