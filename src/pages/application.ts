import { EditorPage } from './editor.page';
import { HomePage } from './home.page';
import { PageHolder } from './page-holder';

/**
 * Aggregates every UI page object for the current browser page.
 */
export class Application extends PageHolder {
  public readonly homePage: HomePage = new HomePage(this.page);
  public readonly editorPage: EditorPage = new EditorPage(this.page);
}
