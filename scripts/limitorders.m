format long g

% price cap
xi = 0.3;
% xi = 0.6;

% LMSR
beta = 0.5;
% q = 10*ones(1,5);
% q = [71.43667960674091200687 72.6286796067409120068];
q = [10274.00373002294873341875 2431.86373002294873341876 961.86373002294873341876 961.86373002294873341876];
i = 1;
qj = [q(1:i-1) q(i+1:end)];
m = max(beta*qj)
n = -q(i) + log(xi*sum(exp(beta*qj))/(1 - xi)) / beta
n = -q(i) + log(xi)/beta - log(1 - xi)/beta + (m + log(sum(exp(beta*qj - m))))/beta
q(i) = q(i) + n;
p_lmsr = exp(beta*q) / sum(exp(beta*q))

% LS-LMSR
clear n
a = 0.0079;
% a = 0.00790000000000000001;
% q = 10*ones(1,5);
q = [71.43667960674091200687 72.6286796067409120068];
i = 1;
qj = [q(1:i-1) q(i+1:end)];
F = @(n) a*log(exp((q(i) + n)/a/(n + sum(q))) + sum(exp(qj/a/(n + sum(q))))) + ...
    (exp((q(i) + n)/a/(n + sum(q)))*sum(qj) - sum(qj.*exp(qj/a/(n + sum(q))))) / ...
    ((n + sum(q))*(exp((q(i) + n)/a/(n + sum(q))) + sum(exp(qj/a/(n + sum(q)))))) - xi;
n0 = fzero(F, [-0.78, 1.78], optimset('Display', 'iter'))
q(i) = q(i) + n0;
b = a*sum(q);
p_lslmsr = a*log(sum(exp(q/b))) + ...
    (exp(q/b)*sum(q) - sum(q.*exp(q/b))) / sum(q) / sum(exp(q/b))

% plot solution
numPts = 1000;
x = linspace(n0 - 5, n0 + 5, numPts);
y = zeros(1, numPts);
for ii = 1:numPts
    y(ii) = F(x(ii));
end
plot(x, zeros(size(x)), 'r--', x, y, 'LineWidth', 2);
xlabel('n');
ylabel('F(n)');
