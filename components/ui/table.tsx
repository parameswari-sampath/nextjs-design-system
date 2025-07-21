import React from "react";
import clsx from "clsx";

// Main Table Component
type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  children: React.ReactNode;
};

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)]">
        <table
          ref={ref}
          className={clsx(
            "w-full caption-bottom text-sm",
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

// Table Header Component
type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  children: React.ReactNode;
};

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={clsx(
          "bg-[var(--color-secondary)]",
          className
        )}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = "TableHeader";

// Table Body Component
type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  children: React.ReactNode;
};

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={clsx(
          "[&_tr:last-child]:border-0",
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = "TableBody";

// Table Row Component
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  children: React.ReactNode;
};

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={clsx(
          "border-b border-[var(--color-border)]",
          "transition-colors hover:bg-[var(--color-secondary)]/50",
          "data-[state=selected]:bg-[var(--color-secondary)]",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

// Table Header Cell Component
type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  children: React.ReactNode;
};

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={clsx(
          "h-12 px-4 text-left align-middle font-semibold text-[var(--color-muted-foreground)]",
          "[&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = "TableHead";

// Table Cell Component
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  children?: React.ReactNode;
};

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx(
          "px-4 py-3 align-middle",
          "[&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = "TableCell";

// Table Caption Component
type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement> & {
  children: React.ReactNode;
};

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        className={clsx(
          "mt-4 text-sm text-[var(--color-muted-foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </caption>
    );
  }
);

TableCaption.displayName = "TableCaption";

export default Table;
export { TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption };