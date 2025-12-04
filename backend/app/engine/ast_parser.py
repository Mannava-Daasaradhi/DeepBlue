import ast
import json

class CodeTo3DVisitor(ast.NodeVisitor):
    def __init__(self):
        self.nodes = []
        self.links = []
        self.parent_stack = [] 
        self.node_counter = 0

    def _add_node(self, label, type_name):
        node_id = f"node_{self.node_counter}"
        self.nodes.append({
            "id": node_id,
            "label": label,
            "type": type_name,
            "group": 1 if type_name == "function" else 2
        })
        self.node_counter += 1
        return node_id

    def _add_link(self, source_id, target_id):
        self.links.append({
            "source": source_id,
            "target": target_id
        })

    def generic_visit(self, node):
        super().generic_visit(node)

    def visit_FunctionDef(self, node):
        node_id = self._add_node(f"Func: {node.name}", "function")
        if self.parent_stack:
            self._add_link(self.parent_stack[-1], node_id)
        self.parent_stack.append(node_id)
        self.generic_visit(node)
        self.parent_stack.pop()

    def visit_For(self, node):
        target = node.target.id if isinstance(node.target, ast.Name) else "iterator"
        node_id = self._add_node(f"Loop: {target}", "loop")
        if self.parent_stack:
            self._add_link(self.parent_stack[-1], node_id)
        self.parent_stack.append(node_id)
        self.generic_visit(node)
        self.parent_stack.pop()

    def visit_If(self, node):
        node_id = self._add_node("Decision: If", "decision")
        if self.parent_stack:
            self._add_link(self.parent_stack[-1], node_id)
        self.parent_stack.append(node_id)
        self.generic_visit(node)
        self.parent_stack.pop()

def parse_code_to_3d(code_string):
    try:
        tree = ast.parse(code_string)
        visitor = CodeTo3DVisitor()
        visitor.visit(tree)
        return {"nodes": visitor.nodes, "links": visitor.links}
    except Exception as e:
        return {"error": str(e), "nodes": [], "links": []}