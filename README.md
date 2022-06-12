# MVC

## 단점

view가 model을 알고 있다. -> business로직이 바뀌어서 model이 바뀌는 순간 view가 다 고쳐져야 한다.

### View가 모델을 모르게 하는 방법

view가 자신의 모든 필드에 대해 getter setter를 제공한다. 그러면 controller는 view의 getter setter만 호출하면 됨.
이게 바로 MVP이다. 뷰는 굉장히 단순.  대신 뷰 하나 만들때마다 엄청난 getter와 setter를 만들어야한다.
java는 ide가 다 만들어준다. js는 없음.

### MVVM

가짜 모델이 view를 알게 한다 바인딩 시켜서. 가짜 모델이 view를 업데이트 하는것이다. 모델이 view를 알게 하는것이다.

모델의 데이터를 집어넣을 뷰만의 선언이 잇다. 그 선언이 모델의 이름이 아니다. 뷰를 바꾸기 위한 이름이다. viewJS에서 view를 업데이트
하기 위해 보낸 데이터가 진짜 모델인가 ? 아니다. 뷰를 업데이트하기 위한 전용 데이터 객체이다. 진짜 모델은 서버에서 받은 json 객체이고
이걸로 viewjs를 바로 업데이트 하는게 아니고 view에 해당하는 key들로 다시 재정의한 객체를 갖고 업데이트 하는것이다. view를 업데이트하기 위해서 재정의 한 모델을 viewModel이라 한다. viewModel이 뷰를 보고 데이터 바인딩을 통해서 해당키에 자동으로 연결하는 구조다.
MVVM은 바인딩하는 엔진만 만들면 getter setter를 엄청 만드는 작업이 없어지면서 view는 여전히 model을 모른다.
