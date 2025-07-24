// Compatibility layer for React Router to Next.js migration
export { default as Link } from "next/link";
export { useRouter as useNavigate } from "next/navigation";
export { useParams } from "next/navigation";

// Mock hook for compatibility
export function useLocation() {
  return { pathname: "/" };
}
