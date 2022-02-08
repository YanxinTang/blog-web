import Breadcrumb from './Breadcrumb';
import Crumb from './Crumb';

type BreadcrumbType = typeof Breadcrumb;

interface BreadcrumbInterface extends BreadcrumbType {
  Crumb: typeof Crumb;
}

const breadcrumbDefaultExport = Breadcrumb as BreadcrumbInterface;
breadcrumbDefaultExport.Crumb = Crumb;

export default breadcrumbDefaultExport;
