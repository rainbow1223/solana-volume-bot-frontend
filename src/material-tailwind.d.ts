import MaterialTailwind from "@material-tailwind/react";

declare module "@material-tailwind/react" {
  interface ButtonProps {
    placeholder?;
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
    crossOrigin?;
  }
  interface BreadcrumbsProps extends ButtonProps {}
  interface NavbarProps {
    placeholder?;
  }

  interface TypographyProps {
    placeholder?;
  }
  interface InputProps {
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
    crossOrigin?;
  }

  interface TextareaProps {
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
  }

  interface MenuItemProps {
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
    placeholder?;
  }

  interface MenuListProps {
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
    placeholder?;
  }

  interface CardProps {
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
    placeholder?;
  }

  interface TypographyProps {
    onPointerEnterCapture?;
    onPointerLeaveCapture?;
    placeholder?;
  }

  interface TabsHeaderProps extends ButtonProps {}

  interface TabProps extends ButtonProps {}

  interface TabsBodyProps extends ButtonProps {}
}
