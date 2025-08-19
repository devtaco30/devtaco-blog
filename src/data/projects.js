export const projects = [
  {
    title: '[블루밍비트] FCM Push 기능 고도화',
    description: [
      '**OneSignal → FCM** 전환 및 설정 누락 이슈 해결',
      '**MongoDB → MySQL** 마이그레이션 완료',
      '**푸시 타입 추상화** 및 **토픽 기반 구독 시스템** 설계',
      '푸시 전송 성능 **30% 향상**',
      '**실시간 푸시 알림** 시스템 구축'
    ],
    technologies: ['Kotlin', 'Spring Boot 3', 'Kafka', 'FCM', 'MySQL'],
    period: '2024.12 - 2025.04'
  },
  {
    title: '[블루밍비트] 뉴스 자동 공유 기능 개선',
    description: [
      '**Kafka** 기반 데이터 처리 파이프라인 구축',  
      '**KafkaStream + KTable** 기반 데이터 처리 파이프라인 추가',
      '**SNS별 전송 조건** 설계 및 **토큰 관리 자동화**',
      '운영 효율성 ** 향상**',
      '**에러 복구 메커니즘** 구현으로 안정성 향상'
    ],
    technologies: ['Kotlin', 'Spring Boot 3', 'Kafka', 'KafkaStreams'],
    period: '2024.10 - 2024.11'
  },
  {
    title: '[블루밍비트] 통합 검색 서비스 MSA 개발',
    description: [
      '**자산, 뉴스, 커뮤니티** 검색 기능 통합',
      '**Query Generator** 및 **하이라이팅 처리기** 구현',
      '검색 속도 **40% 개선**',
      '**글로벌 확장성**을 고려한 모델링 설계',
      '**ElasticSearch** 최적화'
    ],
    technologies: ['Kotlin', 'Spring Boot 3', 'ElasticSearch'],
    period: '2024.10 - 2024.10'
  },
  {
    title: '[블루밍비트] WorldCoin 회원 가입 및 로그인 기능',
    description: [
      '**JWT 기반 인증** 시스템 구축',
      '**World ID 연동**으로 보안 강화',
      '사용자 인증 **안정성 확보**',
      '**OAuth 2.0** 표준 준수'
    ],
    technologies: ['Java', 'Spring Boot', 'JWT', 'World ID'],
    period: '2024.08 - 2024.08'
  },
  {
    title: '[블루밍비트] 가상 자산 거래소 연결 서비스',
    description: [
      '**가상 자산 포트폴리오 API** 구현',
      '**다중 거래소 연동** 서비스 개발',
      '**OAuth2** 인증 시스템 구축',
      '(현재 해당 서비스 중단)'
    ],
    technologies: ['Java', 'Spring Boot', 'OAuth2'],
    period: '2023.12 - 2024.01'
  },
  {
    title: '[블루밍비트] Backend MSA 리빌딩',
    description: [
      '**기존 MSA 프로젝트 재분류** 및 **Core 모듈화**',
      '**Spring Cloud Config** 도입',
      '**AWS Secrets Manager** 연동',
      '시스템 **안정성 및 확장성** 향상'
    ],
    technologies: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'AWS'],
    period: '2023.09 - 2023.12'
  },
  {
    title: '[블루밍비트] AWS 운영환경 및 개발환경 구축 및 2.0 배포',
    description: [
      '**AWS 운영환경** 및 **개발환경** 구축',
      '**Jenkins** CI/CD 구축',
      '**2.0 버전 배포** 완료',
      '**인프라 자동화** 구축'
    ],
    technologies: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'AWS'],
    period: '2023.08 - 2023.09'
  },
  {
    title: '[웨이브릿지] MarketInfo & MarketData 수집 시스템',
    description: [
      '**시장 데이터 수집 시스템** 개선',
      'Node.js 기반 거래소 API 통합 라이브러리**(ccxt)** 활용'
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
    period: '2022.12 - 2023.05'
  },
  {
    title: '[웨이브릿지] 가상자산 Index 시스템 구축 및 고도화',
    description: [
      '**가상자산 거래소 Orderbook/Trade 데이터** 활용',
      '**기준 지수 산출 시스템** 설계 및 구축',
      '**Elastic-Job 기반 배치** 리팩토링',
      '**WebSocket** 실시간 데이터 처리',
      '**실시간/분단위 지수 계산** 엔진 개발',
      '**데이터 품질 검증** 시스템 구축',
      '**성능 모니터링** 및 **알림 시스템** 구현',
      '초기 구축시 **BE, FE, DevOps 모두 구축**',
      '**API 게이트웨이** 구축으로 외부 서비스 연동'
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'AWS', 'Jenkins', 'Elastic-Job', 'Zookeeper'],
    period: '2020.08 - 2022.07'
  }
];
