import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display under this view or filter.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-campus-border bg-campus-card/50">
      <div className="w-14 h-14 rounded-2xl bg-campus-primary/10 border border-campus-primary/20 flex items-center justify-center text-campus-primary mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="font-display font-semibold text-campus-text text-base md:text-lg mb-1">
        {title}
      </h4>
      <p className="text-sm text-campus-textMuted max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

