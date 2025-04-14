import React from 'react';
import './App.css';
import styles from './App.module.css';
import { 
  ParallaxScroll, 
  MagneticButton, 
  ProductShowcase,
  FadeInView,
  SlideInSection,
  StickyScroll
} from './components';
import ParticleWave from './components/ParticleWave';

function App() {
  return (
    <div className={`${styles.appContainer} App`}>
      <div className={styles.particleWrapper}>
        <ParticleWave />
      </div>
      <div className={styles.contentWrapper}>
        <header className="App-header">
          <h1>动效演示</h1>
          <p className="subtitle">使用React实现的纯CSS/JS动效</p>
          
          <MagneticButton className="header-button">
            <span>探索更多</span>
          </MagneticButton>
        </header>

        <section className="section">
          <FadeInView>
            <h2>渐入效果</h2>
            <p>随着页面滚动，元素平滑地淡入显示，带来舒适的视觉体验</p>
          </FadeInView>
        </section>

        <StickyScroll 
          startColor="#121212" 
          endColor="#0071e3"
          height="250vh"
          stickyPosition={25}
        >
          <div className="sticky-section-content">
            <h2>粘性滚动与渐变</h2>
            <p>内容保持在视口中固定位置，背景随滚动渐变变化</p>
            <div className="gradient-showcase">
              <div className="gradient-circle"></div>
              <div className="gradient-circle"></div>
              <div className="gradient-circle"></div>
            </div>
          </div>
        </StickyScroll>

        <section className="section dark parallax-section">
          <h2>视差滚动效果</h2>
          <p>不同元素以不同速度移动，创造出深度感</p>
          <div className="parallax-row">
            <ParallaxScroll speed={-0.3}>
              <div className="parallax-item">
                <h3>背景层</h3>
                <p>滚动速度最慢</p>
                <div className="parallax-visual"></div>
              </div>
            </ParallaxScroll>
            <ParallaxScroll speed={-0.8}>
              <div className="parallax-item">
                <h3>中间层</h3>
                <p>滚动速度适中</p>
                <div className="parallax-visual"></div>
              </div>
            </ParallaxScroll>
            <ParallaxScroll speed={-1.5}>
              <div className="parallax-item">
                <h3>前景层</h3>
                <p>滚动速度最快</p>
                <div className="parallax-visual"></div>
              </div>
            </ParallaxScroll>
          </div>
        </section>

        <section className="section">
          <div className="product-section">
            <SlideInSection direction="right">
              <h2>从右侧滑入</h2>
              <p>元素从屏幕右侧平滑滑入视图</p>
            </SlideInSection>
            
            <SlideInSection direction="left" delay={300}>
              <div className="product-image-placeholder"></div>
            </SlideInSection>
          </div>
        </section>

        <section className="section dark">
          <ProductShowcase>
            <div className="product-box">
              <h2>产品展示</h2>
              <p>跟随滚动或鼠标移动，产品展示角度随之改变</p>
              <div className="product-model"></div>
            </div>
          </ProductShowcase>
        </section>

        <footer>
          <SlideInSection direction="bottom">
            <p>使用React和纯CSS/JS实现的苹果风格动效</p>
            <MagneticButton>
              <span>联系我们</span>
            </MagneticButton>
          </SlideInSection>
        </footer>
      </div>
    </div>
  );
}

export default App;
