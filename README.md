<h2>HTML5 Video Manager</h2>
<a>ダウンロード(comming soon?)</a>
<a href="https://github.com/eskmemorial/HTML5VideoManager" target="_blank" rel="noopener noreferrer">GitHub</a>
<p>
  Chromium Edge用の拡張機能。動画の再生速度・音量の変更、再生時間のスキップおよび巻き戻しを、ショートカットキーから簡単に行えます。
</p>
<h3>背景</h3>
<p>動画の再生を細かく制御するChrome拡張機能はたくさんあります。私は、<a
    href="https://chrome.google.com/webstore/detail/video-speed-controller/nffaoalbilbmmfgbnbgppjihopabppdk"
    target="_blank" rel="noopener noreferrer">Video Speed Controller</a>を使っていました。
  この拡張機能を使うと、再生速度と再生時間のスキップおよび巻き戻しをショートカットキーを用いて行うことができるので便利です。
  一方で、Chromium Edge用の動画制御拡張機能は<a
    href="https://microsoftedge.microsoft.com/addons/detail/mjhlabbcmjflkpjknnicihkfnmbdfced?hl=en-GB" target="_blank"
    rel="noopener noreferrer">Global Speed</a>や<a
    href="https://microsoftedge.microsoft.com/addons/detail/mfoipakdadgplilpebhnebgafaoofblh?hl=en-GB" target="_blank"
    rel="noopener noreferrer">Video Speed Control</a>などがありますが、
  これらでできるのは再生速度の制御のみであり、前述のVideo Speed Controllerのような再生時間に関する制御はできません。
  この拡張機能は、Chromium EdgeでもVideo Speed Controllerと同等の機能を利用するために開発されました。
</p>
<h3>使い方</h3>
<p>この拡張機能をインストールしたうえで何らかの動画を再生してください。以下に各ショートカットキーの挙動を示します。</p>
<h4>再生速度</h4>
<ul>
  <li>「f」 : 再生速度を一段階速くします。</li>
  <li>「s」 : 再生速度を一段階遅くします。</li>
  <li>「d」 : 再生速度をデフォルトに戻します。</li>
</ul>
<h4>再生時間</h4>
<ul>
  <li>「c」 : 15秒先へスキップします。</li>
  <li>「z」 : 15秒前へ巻き戻しします。</li>
  <li>「x」 : 動画を停止または再開します。</li>
</ul>
<h4>音量</h4>
<ul>
  <li>「e」 : 音量を一段階大きくします。</li>
  <li>「q」 : 音量を一段階小さくします。</li>
  <li>「w」 : 音量をデフォルトに戻します。</li>
</ul>
<p>ブラウザのURL欄の右にあるこの拡張機能のアイコンをクリックすることで設定画面にアクセスすることができます。設定画面では、ショートカットキーの変更や再生速度、再生時間、音量の変化量の調節を行えます。</p>
<h3>謝辞</h3>
<p>
  このソフトを作るにあたって、<a href="https://github.com/igrigorik/videospeed" target="_blank" rel="noopener noreferrer">Video Speed
    Controller</a>を参考にしました。manifest.jsonの書き方やMutationObserverの利用方法、iframeの取り扱いなど非常に多くを学びました。
</p>
