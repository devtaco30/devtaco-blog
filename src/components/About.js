import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Avatar, 
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import WorkExperienceSection from './sections/WorkExperienceSection';
import EducationSection from './sections/EducationSection';
import TechnicalSkillsSection from './sections/TechnicalSkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CurrentFocusSection from './sections/CurrentFocusSection';

const About = () => {
  return (
    <Box sx={{ 
      p: 4, 
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* 헤더 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4, 
          mb: 6,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Avatar
            src={`${process.env.PUBLIC_URL}/images/profile/IMG_6985.jpg`}
            sx={{
              width: { xs: 150, md: 200 },
              height: { xs: 150, md: 200 },
              border: '4px solid #000000',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#000000'
            }}>
              박종혁 (DevTaco)
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ 
              color: '#000000', 
              mb: 2,
              fontWeight: 'normal'
            }}>
              Backend Developer
            </Typography>
            <Typography variant="body1" sx={{ 
              fontSize: '1.2rem', 
              lineHeight: 1.8, 
              mb: 3,
              color: '#000000'
            }}>
              안녕하세요, DevTaco입니다 👋<br />
              패션업계에서 디자이너로 일하다가 개발자로 전향한 지 벌써 6년이 되었습니다.<br />
              지금은 Java와 Kotlin을 주로 사용하며 Spring Boot 기반의 다양한 서비스를 만들고 있습니다.<br /><br />
              새로운 기술을 배우는 걸 즐기고, 읽기 좋은 코드를 작성하는 데 집중합니다.<br />
              사용자에게 도움이 되는 서비스를 안정적으로 만들어내는 것이 제 목표입니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="5년차 개발자" sx={{ 
                backgroundColor: '#000000', 
                color: '#ffffff',
                border: '1px solid #000000'
              }} />
              <Chip label="MSA 전문가" sx={{ 
                backgroundColor: '#ffffff', 
                color: '#000000',
                border: '1px solid #000000'
              }} />
              <Chip label="Spring Boot" sx={{ 
                backgroundColor: '#ffffff', 
                color: '#000000',
                border: '1px solid #000000'
              }} />
              <Chip label="Kotlin/Java" sx={{ 
                backgroundColor: '#ffffff', 
                color: '#000000',
                border: '1px solid #000000'
              }} />
              <Chip label="AWS/클라우드" sx={{ 
                backgroundColor: '#ffffff', 
                color: '#000000',
                border: '1px solid #000000'
              }} />
            </Box>
          </Box>
        </Box>
      </motion.div>

      <Divider sx={{ my: 4, borderColor: '#000000' }} />

      {/* Work Experience 섹션 */}
      <WorkExperienceSection />

      <Divider sx={{ my: 4, borderColor: '#000000' }} />

      {/* Education 섹션 */}
      <EducationSection />

      <Divider sx={{ my: 4, borderColor: '#000000' }} />

      {/* Technical Skills 섹션 */}
      <TechnicalSkillsSection />

      <Divider sx={{ my: 4, borderColor: '#000000' }} />

      {/* Projects 섹션 */}
      <ProjectsSection />

      <Divider sx={{ my: 4, borderColor: '#000000' }} />

      {/* Current Focus & Interests 섹션 */}
      <CurrentFocusSection />
    </Box>
  );
};

export default About;
