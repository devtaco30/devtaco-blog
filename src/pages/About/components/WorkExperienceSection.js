import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Chrono } from 'react-chrono';
// import WorkIcon from '@mui/icons-material/Work';
import { motion } from 'framer-motion';
import { experience } from '../../../data/experience';

const WorkExperienceSection = () => {
  // CSS로 인터페이스 요소 숨기기
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* TimelineTitleWrapper의 실제 클래스명 */
      [class*="TimelineTitleWrapper"] {
        width: 300px !important;
        min-width: 300px !important;
        max-width: 350px !important;
      }
      /* 날짜 텍스트 강제 변경 */
      [class*="TimelineTitleWrapper"] *,
      [class*="timeline-item-title"] *,
      [class*="chrono-title"] * {
        color: #000000 !important;
      }
      /* 카드 영역 폭 줄이기 */
      [class*="card-content-wrapper"],
      [class*="TimelineCardContentWrapper"],
      [class*="chrono"] [class*="card"] {
        max-width: 60% !important;
        width: 60% !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);



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
          💼 Work Experience
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        flex: 1,
        width: '100%'
      }}>
        <Chrono
          items={experience.map((exp, index) => ({
            title: exp.period,
            cardTitle: exp.company,
            cardSubtitle: exp.position,
            cardDetailedText: (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 0.5,
                flexWrap: 'nowrap',
                overflowX: 'auto'
              }}>
                {exp.technologies.map((tech) => (
                  <Chip key={tech} label={tech} size="small" sx={{ 
                    backgroundColor: '#ffffff', 
                    color: '#000000',
                    border: '1px solid #000000',
                    margin: '2px',
                    flexShrink: 0
                  }} />
                ))}
              </Box>
            )
          }))}
          mode="VERTICAL"
          cardHeight={120}
          textDensity="HIGH"
          itemWidth={150}
          classNames={{ title: "custom-timeline-title" }}
          disableToolbar={true}
          disableInteraction={true}
          disableClickOnCircle={true}
          disableAutoScrollOnClick={true}
          enableQuickJump={false}
          enableLayoutSwitch={false}
          useReadMore={false}
          theme={{
            primary: '#000000',
            secondary: '#ffffff',
            cardBgColor: '#ffffff',
            cardForeColor: '#000000',
            titleColor: '#000000',
            cardTitleColor: '#000000',
            timelineBgColor: 'transparent'
          }}
        />
      </Box>
    </motion.div>
  );
};

export default WorkExperienceSection;
