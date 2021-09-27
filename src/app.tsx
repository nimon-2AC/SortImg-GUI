import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Main = () => {
  return (
    <div>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>

      <button id="upload-image-files" type="button">ファイルを選択</button>
      <button id="upload-image-files-in-directories" type="button">ディレクトリを選択</button>
      <button id="to-sort" type="button">
        <a href="pages/sort.html">選択を完了してソート</a>
      </button>
      <figure>
        <table>
          <thead>
            <tr>
              <td>選択した画像のパス</td>
              <td></td>
            </tr>
          </thead>
          <tbody id="selected-images">
          </tbody>
        </table>
      </figure>
    </div>
  )
};

ReactDOM.render(<Main />, document.getElementById('react-content'));
