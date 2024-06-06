import { useEffect } from "react";
import { useRouter } from "next/router";
import FormGenerator from "../components/FormGenerator";
import { useAuth } from "../../AuthContext";
import { CircularProgress, Container } from "@mui/material";

const FormGeneratorPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
      if (!loading && !user) {
          router.push('/');
      }
  }, [user, loading, router]);

  if (loading) {
      return (
          <Container style={{display: 'flex',alignItems: 'center',height: '100vh',justifyContent: 'center'}}>
              <CircularProgress />
              <span style={{marginLeft: "40px"}}>Setting up your profile...</span>
          </Container>
      );
  }

  return user ? <FormGenerator /> : null;
};

export default FormGeneratorPage;
