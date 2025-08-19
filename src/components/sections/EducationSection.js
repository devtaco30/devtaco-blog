import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { motion } from 'framer-motion';
import { education } from '../../data/education';

const EducationSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold', 
          mb: 4,
          color: '#000000'
        }}>
          🎓 Education
        </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card elevation={0} sx={{ 
              backgroundColor: 'transparent',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              },
              width: '100%',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              minHeight: '80px',
              pb: index < education.length - 1 ? 2 : 0,
              position: 'relative',
              '&::after': index < education.length - 1 ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '1px',
                backgroundColor: '#e0e0e0'
              } : {}
            }}>
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', width: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <SchoolIcon sx={{ color: '#000000', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: '#000000',
                      mb: 0.5
                    }}>
                      {edu.school}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ 
                    color: '#000000', 
                    fontWeight: 'normal',
                    mb: 0.5
                  }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#666666',
                    fontStyle: 'italic'
                  }}>
                    {edu.period}
                  </Typography>
                </Box>
                              </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default EducationSection;
