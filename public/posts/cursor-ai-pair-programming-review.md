---
title: "Cursor AI와 함께하는 페어 프로그래밍: Backend 개발자의 생산성 혁신"
date: "2025-08-22"
id: "3"
tags: ["Cursor AI", "AI Coding", "Pair Programming", "Backend Development", "Productivity", "Java", "Kotlin", "Spring Boot"]
excerpt: 
  - "Cursor AI와 함께 최근 8개월간 페어 프로그래밍을 진행한 Backend 개발자의 생생한 후기!!"
  - "AI 코딩 어시스턴트의 장단점과 실무 적용 팁을 공유합니다."
---

안녕하세요! 오늘은 Backend 개발자로서 **Cursor AI**와 함께 8개월간 페어 프로그래밍을 진행한 경험을 공유하려고 합니다.

AI 코딩 도구들이 쏟아지는 요즘, 실제로 개발 생산성에 어떤 변화가 있었는지, 그리고 어떤 부분에서 도움을 받았는지 현실적으로 다루어보겠습니다.

## 🚀 **IntelliJ에서 Cursor AI로 전환한 이유**

IntelliJ IDEA는 Java 개발자라면 누구나 알고 있는 강력한 IDE입니다. 3개월 전까지 저도 IntelliJ를 주력으로 사용하며 개발해왔습니다.
Cursor AI 사용을 한 건, Obsidian 과 함께 사용하면 그 활용도가 매우 높다고 해서 사용해 본 것이 시작이었습니다. 그런데 개인적인 용도로 문서도 만드는 데 도움도 받고, 기록용으로도 사용하다보니 꽤 효율을 높여주는 걸 알게 되었습니다. 이후 코드 수정에도 도움을 좀 받으면서 더더욱 실제 개발 보조로 써도 좋겠다는 판단이 서게 되어 도입했습니다.

### **IntelliJ IDEA vs Cursor AI 핵심 비교**

| 구분 | IntelliJ IDEA | Cursor AI |
|------|----------------|-----------|
| **🏗️ 설계 철학** | • 완전한 통합형 IDE<br>• Java/Kotlin 중심<br>• 기존 기능 위주 | • AI 중심 설계 기반<br>• VS Code 포크 기반<br>• 자연어 명령 우선 |
| **🤖 AI 기능** | • JetBrains AI Assistant<br>• 보조적인 AI 기능<br>• 기존 IDE 기능 보완 | • AI 기반 코드 생성<br>• 자연어 명령 처리<br>• 전체 코드베이스 쿼리 |
| **⚡ 개발 속도** | • 안정적이고 정확한 자동완성<br>• 강력한 리팩토링 도구<br>• 심층적인 코드 분석 | • 빠른 탭 기반 제안<br>• 워크플로우 속도 향상<br>• 컨텍스트 인식 자동완성 |
| **🔧 프레임워크 지원** | • Spring Boot 완벽 지원<br>• 데이터베이스 도구 통합<br>• 테스팅 도구 내장 | • 기본적인 Spring Boot 지원<br>• 확장 기능으로 보완<br>• AI 기반 코드 생성 우선 |
| **💰 비용** | • Community: 무료<br>• Ultimate: 유료 | • 기본 기능: 무료<br>• Pro 기능: 유료 |

**전환하게 된 주요 이유들:**
- **자연어로 코드 생성**하는 혁신적인 개발 경험
- **에이전트 기능**으로 터미널 명령 실행 및 오류 반복 대응
- **Privacy Mode**와 **SOC 2 인증**으로 보안성 확보

**실제 테스트 프로젝트:**

**회사 프로젝트 - ElasticSearch**
재직 중이던 회사에서 ElasticSearch 프로젝트를 진행했습니다.  
아직 역량이 부족했던 기술이었지만, Cursor AI 덕분에 추상화와 구현체를 몇 번의 입력으로 완성할 수 있었습니다.

**개인 프로젝트 - React Native 앱**
개인적으로 "운동관련 React Native 앱"을 만들어보았습니다.  
저는 프론트엔드 개발자가 아닙니다. JavaScript나 Vue.js 정도만 다뤄본 수준이었죠.

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; margin: 40px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">

<h3 style="margin: 0 0 15px 0; font-size: 1.4em;">🎨 재미있는 사실!</h3>

<p style="margin: 0; font-size: 1.1em; line-height: 1.6; text-align: center; font-weight: 500;">
이 GitHub Pages 블로그 자체도 <strong>Cursor AI</strong>와 함께 <strong>React</strong>로 개발되었고, 지금 이 포스팅도 <strong>Cursor AI</strong>의 도움을 받아 작성하고 있습니다!
</p>

</div>

**Cursor AI의 도움**
환경 설정부터 앱 개발, 모듈링, 리팩토링까지 모든 과정에서 Cursor AI가 도움을 주었습니다.  
이전에는 로컬 개발환경 설정에서도 벽에 부딪혔지만, 이번에는 거침없이 진행할 수 있었습니다.

## 그럼 실제로 Cursor AI 를 통해 코드를 짜보겠습니다.

> _내가 코드 한 줄도 작성하지 않고 완성해보자!_

이 테스트를 통해 Cursor AI가 실제로 실무 수준의 코드를 생성할 수 있는지, 그리고 AI와 함께하는 개발의 단편적인 부분을 보여드릴게요!

### **Cursor AI 사용법: 효과적인 프롬프트 작성하기**

**실제 Cursor AI로 프로젝트 생성해보기**

다음과 같은 구체적인 프롬프트를 Cursor AI에 입력했습니다:

> "현재 이 폴더에 SpringBoot 프로젝트 하나를 만들자.  
> 단순히 파일을 만드는게 아니라 프로젝트 초기화부터 시작하는 거야.  
> Spring Initializer 로 만들고, build tool 은 gradle 을 사용해.  
> 가장 간단한 User 를 만들고, 수정하고, 삭제하는 API 를 구현할거야.  
> 전통적인 MVC 패턴을 사용해.  
> 어떤 데이터형태든 담아서 반환할 수 있는 응답객체를 정의하고, 거기에 응답 데이터를 담아서 반환하도록 만들어."

**Cursor AI가 실제로 생성한 프로젝트:**

![Cursor AI가 Spring Boot 프로젝트 초기화를 시작하는 화면](/images/posts/3/01.png)

<div align="center">

*Cursor AI가 Spring Boot 프로젝트 초기화를 시작하는 화면*

</div>

![Cursor AI가 명령으로 생성한 ApiResponse 객체](/images/posts/3/02.png)

<div align="center">

*Cursor AI가 명령으로 생성한 ApiResponse 객체*

</div>

![Cursor AI가 명령으로 생성한 User 객체](/images/posts/3/03.png)

<div align="center">

*Cursor AI가 명령으로 생성한 User 객체*

</div>

![실제 curl 요청으로 API 테스트한 결과 화면](/images/posts/3/04.png)

<div align="center">

*실제 curl 요청으로 API 테스트한 결과 화면*

</div>

<div align="center">

**<span style="font-size: 1.2em; font-weight: bold;">여기까지 단 두번의 프롬프트로 만들어진 프로젝트입니다.</span>**

</div>

**결과:**
- Spring Boot 프로젝트 초기화 완료
- Gradle 빌드 도구 설정
- User CRUD API 구현
- MVC 패턴 적용
- 공통 응답 객체 정의

**테스트케이스 작성까지:**
프로젝트 생성 후, 다음과 같은 구체적인 프롬프트로 테스트케이스를 생성했습니다:

> "이제 UnitTest 를 작성해줘  
> @User.java 는 도메인의 성격이 자체적으로 로직을 갖고 있지는 않으니 바로 @UserService.java 를 가지고 테스트 코드를 만들어줘  
> 성공케이스, 실패케이스를 만들어.  
> display name 도 선언해주고, when,given,then 의 플로우를 따라."

이 요청으로 JUnit 5와 Mockito를 사용한 UserService 단위 테스트가 자동으로 생성되었습니다. 성공/실패 케이스, @DisplayName, Given-When-Then 구조까지 완벽하게 구성되어 나왔습니다.

![Cursor AI가 생성한 UserService 테스트케이스](/images/posts/3/05.png)

<div align="center">

*Cursor AI가 생성한 UserService 테스트케이스*

</div>

![테스트케이스 실행 결과 화면](/images/posts/3/06.png)

<div align="center">

*테스트케이스 실행 결과 화면*

</div>

**※ 핵심: AI 도구도 결국 개발자가 얼마나 구체적이고 상세하게 요청하느냐에 따라 결과가 크게 달라집니다.** 

---

## 📊 **IntelliJ에서 Cursor AI로 전환한 실제 체감 효과**

8개월간 Cursor AI를 사용하면서 실제로 체감한 생산성 향상 효과를 정리해보았습니다. 물론 모든 작업에서 Cursor AI가 우수한 것은 아니며, 작업 유형에 따라 차이가 있습니다.

### **실제 체감한 개발 속도 비교**

**Cursor AI의 장점:**
- **패키징과 타이핑 자동화**: import 문, 기본 구조 등을 자동으로 생성
- **코드 검토 효율성**: 생성된 코드를 눈으로 훑고 수정할 부분만 요청하면 됨
- **반복 작업 단축**: 비슷한 패턴의 코드를 빠르게 생성

**하지만 현실적인 한계도 있었습니다:**
- **요청 프롬프트의 중요성**: 잘못된 요청은 오히려 시간을 더 소모
- **수정 과정의 시간**: 원하는 대로 나오지 않으면 수정하는 과정에서 시간 소요
- **IntelliJ의 강력한 제안**: 기존 IntelliJ의 코드 제안도 충분히 강력함

**특히 프로젝트 초기화나 새로운 프레임워크 학습 시에는 더할 나위 없는 조력자입니다:**
- **프로젝트 초기화**: 기본 구조와 설정을 빠르게 구성
- **새로운 프레임워크 학습**: 모르는 기술을 학습하며 프로젝트를 만들어갈 때 최고의 도움
- **개발자 성장**: 새로운 기술 스택을 익히는 과정에서 가이드 역할

**※ 주의: IntelliJ 또한 매우 강력한 도구입니다. Cursor AI는 AI 기반 접근 방식으로 생산성을 향상시킵니다.**

## ⚠️ **한계점과 주의사항**

### **AI가 완벽하지 않은 부분들**

#### 1. **도메인 지식 부족**
AI는 비즈니스 규칙을 모르기 때문에, 단순한 CRUD 코드는 생성할 수 있지만 복잡한 비즈니스 로직 검증이나 도메인 규칙은 개발자가 직접 구현해야 합니다.

#### 2. **보안 관련 주의사항**
AI가 생성한 코드에는 보안 검증이 누락될 수 있습니다. 권한 검증, 입력값 검증, SQL 인젝션 방지 등은 개발자가 직접 확인하고 추가해야 합니다.

---

## 🎯 **실무 적용 팁**

### **효과적인 프롬프트 작성법**

#### **좋은 프롬프트 예시:**
```
"Spring Boot 3.2+ 버전을 사용해서 사용자 인증 API를 만들어줘. 
JWT 토큰 기반이고, Spring Security를 사용하며, 
UserDetailsService를 구현해야 해. 
테스트 코드도 함께 작성해줘."
```

#### **나쁜 프롬프트 예시:**
```
"API 만들어줘"
```

### **Backend 개발자는 AI에게 대체 될 것인가?**

**기존 역할:**
- 코드 작성
- 버그 수정
- 성능 최적화

**여전히 중요한 역할:**
- **비즈니스 로직 검증** (AI가 대체할 수 없음)
- **아키텍처 설계** (시스템 전체 구조 설계)
- **보안 및 품질 관리** (보안은 AI에 맡길 수 없음)
- **AI 생성 코드 검토** (AI가 만든 코드도 사람이 검토해야 함)
- **IDE 선택과 설정** (프로젝트에 맞는 도구 선택)

### **결론**

**IDE 전환 후 느낀 점:**
- **IntelliJ**는 여전히 **Spring Boot 개발의 최고 도구**
- **VS Code + Cursor AI**는 **새로운 개발 경험**과 **AI 활용**에 특화
- **각각의 장단점**이 명확함

**최종 결론:**
- **IntelliJ**는 **전문가 도구** (Spring Boot, 정밀한 분석)
- **Cursor AI**는 **AI 혁신 도구** (빠른 생성, 자연어 코딩)
- **프로젝트 성격**에 따라 **적절한 도구 선택**이 중요
- **혼용 워크플로우**가 가장 효율적
- **AI는 도구일 뿐**, **개발자의 역량**이 여전히 핵심

8개월간 Cursor AI를 사용하면서 느낀 점은, **AI 도구가 개발자를 대체하는 것이 아니라 개발자의 생산성을 향상시키는 도구**라는 것입니다. 

IntelliJ는 여전히 Spring Boot 개발의 최고 도구이며, Cursor AI는 새로운 개발 경험을 제공하는 혁신적인 도구입니다. 두 도구를 적절히 조합하여 사용한다면, 개발 생산성을 크게 향상시킬 수 있을 것입니다.

앞으로 AI 코딩 도구들이 더욱 발전한다면, 개발자의 역할은 **코드 작성**에서 **아키텍처 설계**와 **비즈니스 로직 검증**으로 더욱 집중될 것 같습니다. 하지만 그 핵심에는 여전히 **개발자의 창의성과 문제 해결 능력**이 자리잡고 있을 것입니다.



*이 포스팅은 IntelliJ에서 Cursor AI로 전환한 8개월간의 경험을 바탕으로 작성되었습니다. 각 IDE의 장단점을 현실적으로 파악하고, 프로젝트에 맞는 도구를 선택하는 방법을 찾으시길 바랍니다.*
