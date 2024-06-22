import React from "react";
import {
  Fab,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useAuth } from "../../AuthContext";

const FloatingFeedbackButton = () => {
  const {
    feedback,
    setFeedback,
    handleFeedback,
    success,
    setSuccess,
    openModal,
    handleModalClose,
    handleModalOpen,
  } = useAuth();

  return (
    <>
      <Fab
        color="primary"
        aria-label="feedback"
        onClick={handleModalOpen}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <FeedbackIcon />
      </Fab>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <Typography id="feedback-modal-title" variant="h6" component="h2">
            Submit Feedback
          </Typography>
          <Typography id="feedback-modal-description" sx={{ mt: 2 }}>
            We value your feedback. Please let us know what you think.
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            placeholder="Your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          {feedback && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFeedback}
              style={{ marginTop: "16px" }}
            >
              Submit Feedback
            </Button>
          )}
        </Box>
      </Modal>
      {success && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default FloatingFeedbackButton;
