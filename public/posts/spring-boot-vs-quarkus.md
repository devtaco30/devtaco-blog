---
title: "압도적인 퍼포먼스, Quarkus, 과연 Spring Boot의 대안이 될까?"
date: "2025-08-19"
tags: ["Spring Boot", "Quarkus", "Java", "Framework", "Performance"]
excerpt: "Spring Boot와 Quarkus의 성능, 기능, 사용법을 비교해보고 어떤 상황에서 어떤 프레임워크를 선택해야 하는지 알아봅니다."
---

안녕하세요. 오늘은 백엔드 개발자분들에게 익숙한 Spring Boot와 함께, Quarkus를 비교 분석해보려고 합니다. 'Supersonic Subatomic Java'라는 슬로건을 내세운 Quarkus는 빠른 부팅 시간과 효율적인 리소스 활용으로 주목받고 있습니다.  

본 포스팅에서는 두 프레임워크의 주요 차이점과 실제 성능 비교를 통해, 각 프레임워크가 어떤 프로젝트에 더 적합할지 심층적으로 다루어 보겠습니다.

<div style="text-align: center; margin: 100px 0; position: relative;">
  <div style="display: inline-block; text-align: center; margin-right: 60px;">
    <img src="https://devtaco30.github.io/devtaco-blog/images/icons/springboot.png" alt="Spring Boot Logo" style="display: block; margin-bottom: 10px; width: 180px; height: auto; object-fit: contain;" />
    <div style="font-size: 18px; font-weight: bold; color: #333;">Spring Boot</div>
  </div>
  <span style="font-size: 24px; font-weight: bold; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">VS</span>
  <div style="display: inline-block; text-align: center; margin-left: 60px;">
    <img src="https://devtaco30.github.io/devtaco-blog/images/icons/quarkus.png" alt="Quarkus Logo" style="display: block; margin-bottom: 10px; width: 180px; height: auto; object-fit: contain;" />
    <div style="font-size: 18px; font-weight: bold; color: #333;">Quarkus</div>
  </div>
</div>

## 📊 **핵심 비교 요약**

| 구분 | Spring Boot | Quarkus |
|------|-------------|---------|
| **🚀 성능** | • 런타임 시작: 2-10초<br>• 메모리: 150-400MB<br>• JIT 컴파일 방식 | • 런타임 시작: 50-150ms<br>• 메모리: 12-30MB<br>• AOT 컴파일 방식 |
| **🌟 생태계** | • 풍부한 라이브러리<br>• 완만한 학습 곡선<br>• 국내 표준 | • 제한적 라이브러리<br>• 가파른 학습 곡선<br>• 글로벌 주목 |
| **⚡ 특징** | • JVM 기반<br>• 런타임 유연성<br>• 개발 편의성 | • 네이티브 지원<br>• 빌드 타임 최적화<br>• 클라우드 최적화 |
| **⚠️ 단점** | • 느린 시작 시간<br>• 높은 메모리 사용<br>• 네이티브 미성숙 | • 진입 장벽<br>• 생태계 부족<br>• 국내 인지도 낮음 |

---

## 🚀 **성능 비교**

### 시작 시간 및 메모리 사용량

| 메트릭 | Spring Boot | Quarkus JVM | Quarkus Native |
|--------|-------------|-------------|----------------|
| **런타임 시작 시간** | 2-10초 (기준) | 1-2초 (3-5배 빠름) | 50-150ms (20-40배 빠름) |
| **메모리 사용량** | 150-400MB (기준) | 50-100MB (2-4배 절약) | 12-30MB (10-20배 절약) |
| **처리 성능** | 1x (기준) | 3x 빠름 | - |

### 실제 벤치마크 결과

**테스트 환경:**
- MacBook M1, 16GB RAM
- Java v21
- Spring Boot 3.1.4 vs Quarkus 3.4.1
- 10백만 요청, 50/100/300 동시 연결 테스트

**성능 비교 결과:**
- **Quarkus**: 모든 테스트에서 Spring Boot 대비 **2-3배 빠른 처리 속도**
- **동시 연결 처리**: Quarkus가 Spring Boot보다 **훨씬 효율적**
- **메모리 사용량**: Quarkus가 **더 적은 메모리**로 더 많은 요청 처리

---

## 📌 성능 차이의 핵심: AOT vs JIT

**Spring Boot (JIT 방식)**
> 빌드 → JAR 파일 → JVM 시작 → 클래스 로딩 → JIT 컴파일 → 실행  
> **런타임 시작 시간: 2-10s**

**Quarkus (AOT 방식)**
> 빌드 → 네이티브 바이너리 → 직접 실행  
> **런타임 시작 시간: 50-150ms**

## **왜 이렇게 다른가?**

**Spring Boot**: 런타임에 유연하게 동작하도록 설계되었습니다. 설정 파일을 런타임에 읽고, 어노테이션을 동적으로 처리하고, 필요에 따라 빈을 생성합니다. 이는 개발 편의성을 높이지만, 시작 시간이 오래 걸리는 단점이 있습니다.

**Quarkus**: 빌드 시점에 최적화를 완료합니다. 모든 설정을 분석하고, 필요한 코드만 남기고, 네이티브 이미지로 컴파일합니다. 이렇게 하면 시작이 빠르지만, 빌드 시간이 오래 걸릴 수 있습니다.

---

## 💻 **코드 비교**

### Controller 구현 비교

| 구분 | Spring Boot | Quarkus |
|------|-------------|---------|
| **어노테이션** | `@RestController`, `@RequestMapping` | `@Path`, `@Produces`, `@Consumes` |
| **HTTP 메서드** | `@GetMapping`, `@PostMapping` 등 | `@GET`, `@POST` 등 |
| **경로 변수** | `@PathVariable` | `@PathParam` |
| **응답 타입** | `ResponseEntity<T>` | 직접 반환 |

**Spring Boot Controller:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
}
```

**Quarkus Controller:**
```java
@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {
    
    @Inject
    UserService userService;
    
    @GET
    @Path("/{id}")
    public User getUser(@PathParam("id") Long id) {
        return userService.findById(id);
    }
}
```

### 의존성 주입 비교

> **참고**: 생성자 주입이 더 안전하고 권장되는 방식이지만, 두 프레임워크의 어노테이션 차이를 명확하게 보여주기 위해 필드 주입 형태로 작성했습니다.

| 구분 | Spring Boot | Quarkus |
|------|-------------|---------|
| **서비스 어노테이션** | `@Service` | `@ApplicationScoped` |
| **주입 어노테이션** | `@Autowired` | `@Inject` |
| **스코프** | Spring Bean 스코프 | CDI 스코프 |

**Spring Boot:**
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}
```

**Quarkus:**
```java
@ApplicationScoped
public class UserService {
    
    @Inject
    UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}
```



---

## 🎯 **언제 어떤 프레임워크를 선택할까?**

### Spring Boot를 선택하는 경우
- **대규모 팀**: Spring 생태계에 익숙한 개발자들이 많을 때
- **복잡한 비즈니스 로직**: Spring의 다양한 모듈과 스타터가 필요할 때
- **레거시 시스템 연동**: 기존 Spring 기반 시스템과의 호환성이 중요할 때
- **학습 리소스**: 풍부한 문서, 예제, 커뮤니티 지원이 필요할 때

### Quarkus를 선택하는 경우
- **마이크로서비스**: 빠른 시작과 낮은 메모리 사용량이 중요할 때
- **클라우드 네이티브**: 컨테이너 환경에서 효율적인 리소스 사용이 필요할 때
- **극한 성능**: Native 모드로 수십 밀리초 시작, 20MB 메모리 사용이 필요할 때
- **새로운 프로젝트**: 최신 기술 스택을 도입하고 싶을 때

---

## 📋 **결론**

**Spring Boot**: 안정성, 성숙한 생태계, 완만한 학습 곡선
**Quarkus**: 극한 성능, 클라우드 네이티브, 현대적인 아키텍처

특히 Quarkus의 Native 모드는 수십 밀리초 시작과 20MB 메모리 사용으로 컨테이너 환경에서 뛰어난 효율성을 제공합니다. 하지만 Java EE/MicroProfile에 대한 학습이 필요할 수 있습니다.

어떤 프레임워크를 선택하든, 두 프레임워크 모두 뛰어난 Java 애플리케이션 개발 도구입니다.

---

## 📊 **벤치마크 근거 및 참고 자료**

### 공식 문서 및 가이드
- **[Spring Boot 성능 가이드](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.performance)**: Spring Boot 공식 성능 문서
- **[Quarkus 시작하기](https://quarkus.io/guides/getting-started)**: Quarkus 공식 시작 가이드
- **[GraalVM Native Image](https://www.graalvm.org/latest/reference-manual/native-image/)**: GraalVM Native 컴파일 공식 문서

### 실제 벤치마크 및 성능 분석
- **[Spring Boot vs Quarkus 성능 비교 (2023)](https://medium.com/deno-the-complete-reference/spring-boot-vs-quarkus-performance-comparison-for-hello-world-case-e466d3630329)**: 실제 벤치마크 결과 - 10백만 요청, 동시 연결 테스트
- **[Quarkus vs Spring Boot 성능 및 개발자 경험 비교 (2025)](https://www.javacodegeeks.com/2025/02/quarkus-vs-spring-boot-performance-and-developer-experience-compared.html)**: 상세한 성능 분석 및 사용 사례별 비교
- **[Spring Boot 3.0 성능 개선사항](https://spring.io/blog/2022/11/24/spring-boot-3-0-goes-ga)**: Spring Boot 3.0의 성능 개선 내용
- **[Quarkus 블로그](https://quarkus.io/blog/)**: Quarkus 팀의 최신 성능 관련 포스트들

### 개발자 커뮤니티 자료
- **[Quarkus GitHub 저장소](https://github.com/quarkusio/quarkus)**: 공식 소스코드 및 이슈 트래킹
- **[Spring Boot GitHub 저장소](https://github.com/spring-projects/spring-boot)**: Spring Boot 공식 소스코드
