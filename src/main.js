import './assets/main.css'
import 'vant/lib/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLuckyCanvas from '@lucky-canvas/vue'
import App from './App.vue'
import router from './router'
import VueClipboard from 'vue3-clipboard'
import {
  Form,
  Field,
  CellGroup,
  Button,
  Dialog,
  Space,
  Popover,
  Popup,
  Tab,
  Tabs,
  CouponCell,
  CouponList,
  Image,
  Loading,
  Tabbar,
  TabbarItem,
  Icon,
  Cell,
  NavBar,
  Slider,
  Radio,
  Switch,
  List,
  Empty,
} from 'vant'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueLuckyCanvas)
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
})
app.use(Form);
app.use(Field);
app.use(Cell);
app.use(CellGroup);
app.use(Button);
app.use(Dialog);
app.use(Space);
app.use(Popover);
app.use(Popup);
app.use(Tab);
app.use(Tabs);
app.use(CouponCell);
app.use(CouponList);
app.use(Image);
app.use(Loading);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Icon);
app.use(NavBar);
app.use(Slider);
app.use(Radio);
app.use(Switch);
app.use(List);
app.use(Empty);
app.mount('#app')
