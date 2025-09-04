import './assets/main.css'
import 'vant/lib/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLuckyCanvas from '@lucky-canvas/vue'
import App from './App.vue'
import router from './router'
import { Form, Field, CellGroup, Button, Dialog, Space, Popover, Popup, Tab, Tabs, CouponCell, CouponList, Image, Loading ,Tabbar, TabbarItem} from 'vant';
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueLuckyCanvas)

app.use(Form);
app.use(Field);
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
app.mount('#app')
