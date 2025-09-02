import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageModal = ({ open, onClose, src, alt }) => {
  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="90vw"
      maxHeight="90vh"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'none',
          borderRadius: 0
        }
      }}
      BackdropProps={{
        onClick: handleBackdropClick
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* 닫기 버튼 */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            },
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 이미지 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            p: 2
          }}
        >
          <img
            src={src}
            alt={alt || 'Blog post image'}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onClick={handleClose}
          />
        </Box>

        {/* 이미지 설명 */}
        {alt && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              maxWidth: '80%',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2">
              {alt}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
