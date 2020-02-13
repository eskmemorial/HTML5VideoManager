    <style>
    <!--
        article h3 {
        border-bottom: solid rgb(53, 53, 53) 3px;
    }
    article h4 {
        margin-bottom: 0;
    }
    article p {
        line-height: 2;
    }
    article h4+p {
        margin-top: 0;
    }
    article a[target='_blank']::after {
        content: "";
        height: 16px;
        width: 16px;
        padding-left: 16px;
        background: url(https://media.eskmemorial.jp/image/www/outerlink) no-repeat center left;
    }
    article div.code {
        width: 98%;
        margin: 10px auto;
        border: 2px solid gray;
    }
    article div.code>div.code_lang {
        padding-left: 10px;
        color: white;
        font-weight: bolder;
        background-color: gray;
    }
    article div.code>div.code_body {
        padding: 10px 20px 10px;
        overflow: auto;
    }
    article div.code>div.code_body>code {
        font-family: sans-serif;
        white-space: nowrap;
        white-space: pre;
    }
    article table {
        width: 98%;
        margin: 0 auto;
        border: solid 2px gray;
        border-collapse: collapse;
    }
    article th {
        border: solid 2px gray;
    }
    article td {
        border: solid 2px gray;
        padding: 0.5em 10px;
    }
    article div.citation {
        background-color: rgb(224, 224, 224);
        width: 90%;
        margin: 10px auto;
        padding: 20px;
        overflow: auto;
    }
    article div.citation>blockquote {
        margin: 16px 40px;
    }
    article dd {
        line-height: 2;
    }
    article div.citation>cite {
        margin: 16px 40px;
    }
    -->
    </style>
    
    <article>
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
                href="https://microsoftedge.microsoft.com/addons/detail/mjhlabbcmjflkpjknnicihkfnmbdfced?hl=en-GB"
                target="_blank" rel="noopener noreferrer">Global Speed</a>や<a
                href="https://microsoftedge.microsoft.com/addons/detail/mfoipakdadgplilpebhnebgafaoofblh?hl=en-GB"
                target="_blank" rel="noopener noreferrer">Video Speed Control</a>などがありますが、
            これらでできるのは再生速度の制御のみであり、前述のVideo Speed Controllerのような再生時間に関する制御はできません。
            この拡張機能は、Chromium EdgeでもVideo Speed Controllerと同等の機能を利用するために開発されました。
        </p>
        <h3>使い方</h3>

        <iframe width="900" height="506" src="https://www.youtube.com/embed/3P8PQ6uR1SE" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <p>この拡張機能をインストールしたうえで上の動画を再生してください。以下に各ショートカットキーの挙動を示します。</p>
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
            このソフトを作るにあたって、<a href="https://github.com/igrigorik/videospeed" target="_blank"
                rel="noopener noreferrer">Video Speed
                Controller</a>を参考にしました。manifest.jsonの書き方やMutationObserverの利用方法など非常に多くを学びました。
        </p>
    </article>
