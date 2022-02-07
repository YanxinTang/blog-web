import Header from './Header';
import HeaderAdmin from './HeaderAdmin';

type HeaderType = typeof Header;

interface HeaderInterface extends HeaderType {
  Admin: typeof HeaderAdmin;
}

const defaultExport = Header as HeaderInterface;
defaultExport.Admin = HeaderAdmin;

export default defaultExport;
