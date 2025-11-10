export default function SyncStatus({ status }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'saving':
        return { icon: 'bi-arrow-repeat', text: 'Saving...', variant: 'warning' };
      case 'deleting':
        return { icon: 'bi-arrow-repeat', text: 'Deleting...', variant: 'warning' };
      case 'syncing':
        return { icon: 'bi-cloud-arrow-down', text: 'Syncing...', variant: 'info' };
      case 'idle':
        return { icon: 'bi-check-circle', text: 'All changes saved', variant: 'success' };
      default:
        return { icon: 'bi-circle', text: 'Ready', variant: 'secondary' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`d-flex align-items-center text-${statusInfo.variant}`}>
      <i className={`bi ${statusInfo.icon} me-1`}></i>
      <small>{statusInfo.text}</small>
    </div>
  );
}