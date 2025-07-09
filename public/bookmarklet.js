(async function () {
  const extractTicketsFromDOM = (targetDocument) => {
    const ticketListContainer = targetDocument.getElementById("ticket-list");
    if (!ticketListContainer) return [];
    const ticketULs = Array.from(ticketListContainer.querySelectorAll("ul.inner"));
    return ticketULs.slice(1).map((ticketUL) => {
      const laneText = ticketUL.querySelector("li").textContent.trim();
      const expiration = ticketUL.querySelector("li:nth-child(2)").textContent.trim();
      return { laneText, expiration };
    });
  };

  const getLastPageNumber = (targetDocument) => {
    const pageLinks = Array.from(targetDocument.querySelectorAll("#ticket-page a"));
    if (pageLinks.length === 0) return 0;
    const pageNumbers = pageLinks
      .map((link) => parseInt(new URL(link.href, window.location.origin).searchParams.get("page"), 10))
      .filter((num) => !isNaN(num));
    return Math.max(...pageNumbers, 0);
  };

  const loadingHTML = `
    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background-color:white; color:black; font-family:sans-serif;">
      <h1 style="margin-bottom:20px;">全ページのチケット情報を収集中...</h1>
      <p id="progress-text" style="font-size:1.2em;">最初のページを読み込み中...</p>
      <p style="margin-top:20px; font-size:0.8em; color:#555;">この処理には数秒〜数十秒かかる場合があります。</p>
    </div>
  `;

  const resultsHTML = `
    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background-color:white; color:black; font-family:sans-serif;">
      <h1 style="margin-bottom:10px;">チケット情報の抽出が完了しました</h1>
      <p style="margin-bottom:20px;">以下のテキストエリアの内容をすべてコピーし、ツールに貼り付けてください。</p>
      <textarea id="result-json" style="width:80%; height:50vh; font-size:14px; border:1px solid #ccc; padding:10px;"></textarea>
    </div>
  `;

  document.body.innerHTML = loadingHTML;
  const progressText = document.getElementById("progress-text");

  try {
    const allTickets = [];
    const lastPage = getLastPageNumber(document);
    const baseUrl = "https://p.eagate.573.jp/game/2dx/32/djdata/random_lane/index.html";

    for (let i = 0; i <= lastPage; i++) {
      if (progressText) {
        progressText.textContent = `${i + 1} / ${lastPage + 1} ページ目を処理中...`;
      }

      const response = await fetch(`${baseUrl}?page=${i}`);
      const htmlText = await response.text();
      const nextPageDoc = new DOMParser().parseFromString(htmlText, "text/html");

      const ticketsOnPage = extractTicketsFromDOM(nextPageDoc);
      allTickets.push(...ticketsOnPage);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    document.body.innerHTML = resultsHTML;

    const jsonText = JSON.stringify(allTickets, null, 2);
    const resultTextArea = document.getElementById("result-json");

    resultTextArea.value = jsonText;
    resultTextArea.select();
    resultTextArea.focus();
  } catch (e) {
    if (progressText) {
      progressText.innerHTML = `<span style="color:red;">処理中にエラーが発生しました: ${e.message}</span>`;
    } else {
      alert("処理中にエラーが発生しました。\n" + e.message);
    }
  }
})();
